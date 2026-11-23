import type { PoolClient } from "pg";

export type IdempotencyStatus = 'PROCESSING' | 'COMPLETED';

interface IdempotencyRecord{
  id: string;
  user_id: string;
  transaction_id: string | null;
  idempotency_key: string;
  hash_request: string;
  status: IdempotencyStatus;
  response_body: Record<string, unknown> | null;
  created_at: Date;
}
interface InputIdempotency {
  userId: string;
  idempotencyKey: string;
  hashRequest: string;
};


const createIdempotencyRecord = async (client: PoolClient, input: InputIdempotency):Promise<IdempotencyRecord | null> => {
  const sql = `
    INSERT INTO idempotency_keys(user_id,idempotency_key,hash_request)
    VALUES
      ($1,$2,$3)
    ON CONFLICT (user_id,idempotency_key)
    DO NOTHING
    RETURNING *;
  `;

  const values = [
    input.userId,
    input.idempotencyKey,
    input.hashRequest
  ];

  const result = await client.query<IdempotencyRecord>(sql, values);
  return result.rows[0] ?? null;;
};

const getIdempotencyRecord = async (client: PoolClient, userId: string, idempotencyKey: string): Promise<IdempotencyRecord | null> => {
  const sql = `
    SELECT * FROM idempotency_keys
    WHERE user_id=$1 AND idempotency_key = $2
    FOR UPDATE;
  `;
  const values = [userId, idempotencyKey];

  const result = await client.query(sql, values);
  return result.rows[0] ?? null;
};




// when either we createIdem  or find the existing record we need to create a record so here is  completed idempotencykeys

const completedIdempotencyRecord = async (
  client: PoolClient, userId: string, idempotencyKey: string, transationId: string, responseBody: Record<string, unknown>
): Promise<IdempotencyRecord | null> => {
  const sql = `
    UPDATE idempotency_keys
    SET status='COMPLETED',
        transaction_id = $3,
        response_body =$4
    WHERE user_id =$1
      AND idempotency_key=$2
      AND status ='PROCESSING'
    RETURNING *;
  `;
  const values = [userId, idempotencyKey, transationId,JSON.stringify(responseBody)];
  const result = await client.query<IdempotencyRecord>(sql, values);

  return result.rows[0] ?? null;
}



export default {
  createIdempotencyRecord,
  getIdempotencyRecord,
  completedIdempotencyRecord
};
