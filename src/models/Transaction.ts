import type { PoolClient } from "pg";


export type TransactionType = 'DEPOSIT' | 'WITHDRAWAL' | 'TRANSFER';
export type TransactionStatus = 'PENDING' | 'COMPLETED' | 'FAILED';

export type InputTransaction = {
  walletId: string;
  type: TransactionType;
  amountMinor: string;
  transferId?: string;
  status?: TransactionStatus;
}
export type Transaction = {
  id: string;
  wallet_id: string;
  type: TransactionType;
  amount_minor: string;
  status: TransactionStatus;
  created_at: Date;
}

const createTransaction = async(client:PoolClient,input:InputTransaction):Promise<Transaction> => {

  const sql = `
    INSERT INTO transactions (wallet_id,type,amount_minor,status,transfer_id)
    VALUES ($1,$2,$3,$4,$5)
    RETURNING id,wallet_id,type,amount_minor,status,transfer_id
  `;

  const values = [
    input.walletId,
    input.type,
    input.amountMinor,
    input.status ?? "COMPLETED",
    input.transferId ?? null
  ];

  const result =await client.query<Transaction>(sql, values);

  const transaction = result.rows[0];
  if (!transaction) {
    throw new Error("Faild to create transaction")
  };

  return transaction;

}


export default{
  createTransaction
}
