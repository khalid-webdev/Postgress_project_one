import { pool } from "../config/db.js";
export type Wallet = {
  id: string;
  userId: string;
  currency: string;
  balance_minor: string; //The pg driver normally returns BIGINT as a string, so we deliberately type it as string.
  created_at: Date;
  updated_at?: Date;
}


const createWallet = async(userId:string,currency:string):Promise<Wallet | null> => {
  const sql = `
    INSERT INTO wallets(user_id,currency)
    VALUES ($1,$2)
    RETURNING id,user_id,currency,balance_minor,created_at,updated_at
  `;
  const result =await pool.query(sql, [userId, currency]);
  return result.rows[0] ?? null;
}


const getWalletsByUserId = async (userId: string): Promise<Wallet[]> => {
  const sql = `
    SELECT id, user_id,currency,balance_minor,created_at, updated_at
    FROM wallets
    WHERE user_id =$1
    `;
  const result = await pool.query<Wallet>(sql, [userId]);
  return result.rows ?? null;
};

const getWalletById = async (userId: string, walletId: string): Promise<Wallet | null> => {
  const sql = `
    SELECT id,user_id,currency,balance_minor,created_at,updated_at
    FROM wallets
    WHERE user_id=$1 AND id = $2
    LIMIT 1;
  `;
  const result = await pool.query<Wallet>(sql, [userId, walletId]);
  return result.rows[0] ?? null;
}


export default {
  createWallet,
  getWalletsByUserId,
  getWalletById
};
