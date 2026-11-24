import type { InputUpdateWallet, Wallet } from "./wallet.types.js";
import type { PoolClient } from "pg";
import { pool } from "../../config/db.js";


const createWalletModel = async(userId:string,currency:string):Promise<Wallet | null> => {
  const sql = `
    INSERT INTO wallets(user_id,currency)
    VALUES ($1,$2)
    RETURNING id,user_id,currency,balance_minor,created_at,updated_at
  `;
  const result =await pool.query(sql, [userId, currency]);
  return result.rows[0] ?? null;
}


const getWalletsByUserIdModel = async (userId: string): Promise<Wallet[]> => {
  const sql = `
    SELECT id, user_id,currency,balance_minor,created_at, updated_at
    FROM wallets
    WHERE user_id =$1
    `;
  const result = await pool.query<Wallet>(sql, [userId]);
  return result.rows;
};

const getWalletByIdModel = async (userId: string, walletId: string): Promise<Wallet | null> => {
  const sql = `
    SELECT id,user_id,currency,balance_minor,created_at,updated_at
    FROM wallets
    WHERE user_id=$1 AND id = $2
    LIMIT 1;
  `;
  const result = await pool.query<Wallet>(sql, [userId, walletId]);
  return result.rows[0] ?? null;
}


const updateWalletBalanceModel = async (client:PoolClient,input:InputUpdateWallet):Promise<Wallet | null> => {
  const sql = `
    UPDATE wallets
    SET
      balance_minor = balance_minor + $1,
      updated_at = CURRENT_TIMESTAMP
    WHERE id=$2 AND user_id =$3
    RETURNING id,balance_minor;
  `;
  const values = [
    input.amountMinor,
    input.walletId,
    input.userId
  ];

  const result = await client.query(sql, values);
  return result.rows[0];
}

const withdrawalWalletBalanceModel = async (client: PoolClient, input: InputUpdateWallet):Promise<Wallet | null> => {
  const sql = `
    UPDATE wallets
    SET
      balance_minor = balance_minor - $1,
      updated_at = CURRENT_TIMESTAMP
    WHERE id = $2
      AND user_id = $3
      AND balance_minor >= $1
    RETURNING *;
  `;
  const values = [
    input.amountMinor,
    input.walletId,
    input.userId
  ];
  const result = await client.query<Wallet>(sql, values);

  const withdrawalWallet = result.rows[0] ?? null;
  return withdrawalWallet;
}

//select....for update
const getWalletForUpdateModel = async (client: PoolClient, walletId: string, userId: string) => {
  const sql = `
    SELECT * FROM wallets
    WHERE id = $1 AND user_id = $2
    FOR UPDATE
  `;
  const values = [walletId, userId];
  const result = await client.query<Wallet>(sql, values);
  return result.rows[0] ?? null;
};


//transfer money: creditReceiverWallet
const creditReceiverWalletModel = async (client: PoolClient, walletId: string, amountMinor: string): Promise<Wallet | null> => {
  const sql = `
    UPDATE wallets
    SET
      balance_minor = balance_minor + $1,
      updated_at = CURRENT_TIMESTAMP
    WHERE id = $2
    RETURNING *;
  `;
  const values = [amountMinor, walletId];
  const result = await client.query<Wallet>(sql, values);
  return result.rows[0] ?? null;
};

//transfer debit/deduct money we are gonna use the withdraw wallet balance

// for locking we can't use the getWallet for update cause the user_id we don't know the receiver userid
// for transfer locking
const getWalletForTransferUpdateModel = async (client: PoolClient, senderWalletId: string,receiverWalletId:string):Promise<Wallet[]> => {
  const sql = `
    SELECT *
    FROM wallets
    WHERE id IN ($1,$2)
    ORDER BY id
    FOR UPDATE
  `;
  const result = await client.query<Wallet>(sql, [senderWalletId,receiverWalletId]);

  return result.rows;
}



export {
  createWalletModel,
  getWalletsByUserIdModel,
  getWalletByIdModel,
  updateWalletBalanceModel,
  withdrawalWalletBalanceModel,
  getWalletForUpdateModel,
  creditReceiverWalletModel,
  getWalletForTransferUpdateModel
};
