export type IdempotencyStatus = 'PROCESSING' | 'COMPLETED';

export interface IdempotencyRecord{
  id: string;
  user_id: string;
  transaction_id: string | null;
  idempotency_key: string;
  hash_request: string;
  status: IdempotencyStatus;
  response_body: Record<string, unknown> | null;
  created_at: Date;
}
export interface InputIdempotency {
  userId: string;
  idempotencyKey: string;
  hashRequest: string;
};
