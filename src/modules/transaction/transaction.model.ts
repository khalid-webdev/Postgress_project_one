import type { PoolClient } from "pg";
import type { InputTransaction, TypeTransaction } from "./transaction.types.js";


const createTransaction = async(client:PoolClient,input:InputTransaction):Promise<TypeTransaction> => {

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

  const result =await client.query<TypeTransaction>(sql, values);

  const transaction = result.rows[0];
  if (!transaction) {
    throw new Error("Faild to create transaction")
  };

  return transaction;

}


export{
  createTransaction
}
