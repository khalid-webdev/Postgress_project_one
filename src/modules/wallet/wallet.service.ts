import { pool } from "../../config/db.js";
import Idempotency from "../idempotency/idempotency.model.js";
import Transaction from "../transaction/transaction.model.js";


import Wallet from "../wallet/wallet.model.js"
import type { Wallet as TypeWallet } from "../wallet/wallet.types.js";
import type { TypeTransaction } from "../transaction/transaction.types.js";
import type { TransferWalletInput } from "./wallet.types.js";
import AppError from "../../utils/AppError.js";
import { hashIdempotencyKey } from "../../utils/hash.idempotency.js";

type UpdateWalletType = {
  wallet?: TypeWallet;
  transaction?: TypeTransaction;
}


const createWallet = async (userId: string, currency: string) => {
  try {
    const wallet = await Wallet.createWallet(userId, currency);
    return wallet;
  } catch (error) {
    if (typeof error === "object" && error !== null && 'code' in error && error.code === '23505') {
      throw new AppError(409, `You already have a ${currency} wallet`);
    }
    throw error;
  }
};

const getUserWallets = async (userId: string) => {
  const wallets = await Wallet.getWalletsByUserId(userId);
  return wallets;
}


const getWalletById = async (userId: string, walletId: string) => {

  const wallet = await Wallet.getWalletById(userId, walletId);

  if (!wallet) {
    throw new AppError(404, "Wallet not found!");
  }
  return wallet;

}

const dipositToWallet = async (userId: string, walletId: string, amountMinor: string,idempotencyKey:string):Promise<UpdateWalletType> => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const hashRequest = hashIdempotencyKey({
      operationType: "DEPOSIT",
      walletId,
      amountMinor
    });

    const newRecord = await Idempotency.createIdempotencyRecord(client, {
      userId,
      idempotencyKey,
      hashRequest
    });
    if (!newRecord) {
      //existing record
      const existingRecord = await Idempotency.getIdempotencyRecord(client, userId, idempotencyKey)
      if (!existingRecord) {
        throw new AppError(409,"Unable to process request")
      }
      if (existingRecord.hash_request !== hashRequest) {
        throw new AppError(409,"Idempotency key already used for a different request")
      };
      if (existingRecord.status === "COMPLETED" && existingRecord.response_body) {
        await client.query("COMMIT");
        return existingRecord.response_body;
      }
      throw new AppError(409,"This request is still being processed")
    }


    const wallet = await Wallet.getWalletById(userId, walletId);
    if (!wallet) {
      throw new AppError(404, "No wallet! wallet not found!");
    }
    const updateWallet = await Wallet.updateWalletBalance(client, {walletId, userId,amountMinor});
    if (!updateWallet) {
      throw new AppError(400, 'Faled to update the wallet');
    };

    const newTransaction = await Transaction.createTransaction(client, {
      walletId,
      type: 'DEPOSIT',
      amountMinor,
      status: 'COMPLETED'
    });

    const responseBody = {
      wallet: updateWallet,
      transaction:newTransaction
    }
    const completedRecord = await Idempotency.completedIdempotencyRecord(
      client, userId, idempotencyKey, newTransaction.id, responseBody
    );
    if (!completedRecord) {
      throw new Error("Failed to complete idempotency record")
    }
    await client.query("COMMIT");
    return responseBody;
  } catch (error) {
    await client.query("ROLLBACK")
    throw error;
  } finally {
    client.release()
  }

}

const withdrawFromWallet = async (userId:string,walletId:string,amountMinor:string,idempotencyKey:string):Promise<UpdateWalletType> => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const hashRequest = hashIdempotencyKey({
      operationType: "WITHDRAWAL",
      walletId,
      amountMinor
    });

    const newRecord = await Idempotency.createIdempotencyRecord(client, { userId, idempotencyKey, hashRequest });
    if (!newRecord) {
      const existingRecord = await Idempotency.getIdempotencyRecord(client, userId, idempotencyKey);

      if (!existingRecord) {
        throw new AppError(409,'Unable to process the request')
      }
      //same key but different request
      if (existingRecord.hash_request !== hashRequest) {
        throw new AppError(409, "This Idempotency key already used for a different request");
      }
      //same request but already completed
      if (existingRecord.status === "COMPLETED" && existingRecord.response_body) {
        await client.query("COMMIT");
        return existingRecord.response_body;
      }
      throw new AppError(409,"This request still being processed")
      // end here
    }

    const wallet =await Wallet.getWalletForUpdate(client, walletId, userId);

    if (!wallet) {
      throw new AppError(404, "No wallet found");
    }
    if (BigInt(wallet.balance_minor) < BigInt(amountMinor)) {
      throw new AppError(400,"Insufficieant balance")
    };

    const updatedWallet = await Wallet.withdrawalWalletBalance(client, { amountMinor, userId, walletId });
    if (!updatedWallet) {
      throw new AppError(400,"Insufficient balance")
    };

    const newTransaction = await Transaction.createTransaction(client, {
      walletId,
      type: "WITHDRAWAL",
      amountMinor,
      status: "COMPLETED"
    });

    // prepare original api response
    const responseBody = {
        wallet: updatedWallet,
        transaction: newTransaction
    };
    //mark idempotency record as completed
    const completedRecord = await Idempotency.completedIdempotencyRecord(client, userId, idempotencyKey, newTransaction.id, responseBody);
    if (!completedRecord) {
      throw new Error("Failed to complete idempotency record")
    };
    //commit finaly
    await client.query("COMMIT");

    return responseBody;
  } catch (error) {
    await client.query("ROLLBACK")
    throw error;
  } finally {
    client.release();
  }
}


// This is important because a transfer is one of the most sensitive operations in a fintech backend.

const transferWallet = async (input: TransferWalletInput) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");









    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}


export default {
  createWallet,
  getUserWallets,
  getWalletById,
  dipositToWallet,
  withdrawFromWallet
}
