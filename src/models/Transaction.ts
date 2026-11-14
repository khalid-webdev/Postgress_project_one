import type { PoolClient } from "pg";

type TransactionType = 'DIPOSIT' | 'WITHDRAWAL' | 'TRANSFER';

type TransactionStatus = 'PENDING' | 'COMPLETED' | 'FAILED';

interface Transaction {
  id: string;
  wallet_id: string;
  type: TransactionType;
  amount_minor: string;
  status: TransactionStatus;
  createdAt: Date;
}

interface InputTransaction {
  wallet_id: string;
  type: TransactionType;
  amountMinor: string;
  status: TransactionStatus;
};

const createTransaction = async (client: PoolClient, input: InputTransaction): Promise<Transaction> => {
  const sql = `
    INSERT INTO wallet_id,type,amount_minor,status
    VALUES ($1,$2,$3,$4)
    RETURNING id, wallet_id,type,amount_minor,status,created_at
  `;
  const values = [
    input.wallet_id,
    input.type,
    input.amountMinor,
    input.status ?? 'COMPLETED'
  ];
  const result = await client.query<Transaction>(sql, values);

  const transaction = result.rows[0];
  if (!transaction) {
    throw new Error("Failed to create transaction")
  }
  return transaction;

};

export default {
  createTransaction
};
