import { pool } from "../../config/db.js";
import type { TransferWalletInput, UpdateWalletType } from "./wallet.types.js";
import AppError from "../../utils/AppError.js";
import { hashIdempotencyRequest } from "../../utils/hash.idempotency.js";
import { createWalletModel, getWalletByIdModel, getWalletForUpdateModel, getWalletsByUserIdModel, updateWalletBalanceModel, withdrawalWalletBalanceModel } from "./wallet.model.js";
import { completedIdempotencyRecord, createIdempotencyRecord, getIdempotencyRecord } from "../idempotency/idempotency.model.js";
import { createTransaction } from "../transaction/transaction.model.js";




const createWalletService = async (userId: string, currency: string) => {
  try {
    const wallet = await createWalletModel(userId, currency);
    return wallet;
  } catch (error) {
    if (typeof error === "object" && error !== null && 'code' in error && error.code === '23505') {
      throw new AppError(409, `You already have a ${currency} wallet`);
    }
    throw error;
  }
};

const getUserWalletsService = async (userId: string) => {
  const wallets = await getWalletsByUserIdModel(userId);
  return wallets;
}


const getWalletByIdService = async (userId: string, walletId: string) => {

  const wallet = await getWalletByIdModel(userId, walletId);

  if (!wallet) {
    throw new AppError(404, "Wallet not found!");
  }
  return wallet;

}

const depositToWalletService = async (userId: string, walletId: string, amountMinor: string,idempotencyKey:string):Promise<UpdateWalletType> => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const hashRequest = hashIdempotencyRequest({
      operationType: "DEPOSIT",
      walletId,
      amountMinor
    });

    const newRecord = await createIdempotencyRecord(client, {
      userId,
      idempotencyKey,
      hashRequest
    });
    if (!newRecord) {
      //existing record
      const existingRecord = await getIdempotencyRecord(client, userId, idempotencyKey)
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


    const wallet = await getWalletByIdModel(userId, walletId);
    if (!wallet) {
      throw new AppError(404, "No wallet! wallet not found!");
    }
    const updateWallet = await updateWalletBalanceModel(client, {walletId, userId,amountMinor});
    if (!updateWallet) {
      throw new AppError(400, 'Faled to update the wallet');
    };

    const newTransaction = await createTransaction(client, {
      walletId,
      type: 'DEPOSIT',
      amountMinor,
      status: 'COMPLETED'
    });

    const responseBody = {
      wallet: updateWallet,
      transaction:newTransaction
    }
    const completedRecord = await completedIdempotencyRecord(
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

const withdrawFromWalletService = async (userId:string,walletId:string,amountMinor:string,idempotencyKey:string):Promise<UpdateWalletType> => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const hashRequest = hashIdempotencyRequest({
      operationType: "WITHDRAWAL",
      walletId,
      amountMinor
    });

    const newRecord = await createIdempotencyRecord(client, { userId, idempotencyKey, hashRequest });
    if (!newRecord) {
      const existingRecord = await getIdempotencyRecord(client, userId, idempotencyKey);

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

    const wallet =await getWalletForUpdateModel(client, walletId, userId);

    if (!wallet) {
      throw new AppError(404, "No wallet found");
    }
    if (BigInt(wallet.balance_minor) < BigInt(amountMinor)) {
      throw new AppError(400,"Insufficieant balance")
    };

    const updatedWallet = await withdrawalWalletBalanceModel(client, { amountMinor, userId, walletId });
    if (!updatedWallet) {
      throw new AppError(400,"Insufficient balance")
    };

    const newTransaction = await createTransaction(client, {
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
    const completedRecord = await completedIdempotencyRecord(client, userId, idempotencyKey, newTransaction.id, responseBody);
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

const transferWalletService = async (input: TransferWalletInput) => {
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


export {
  createWalletService,
  getUserWalletsService,
  getWalletByIdService,
  depositToWalletService,
  withdrawFromWalletService,
  transferWalletService
}
