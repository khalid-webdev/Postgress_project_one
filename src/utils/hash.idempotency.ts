import { createHash } from "node:crypto";

interface IdempotencyRequest{
  operationType: 'DEPOSIT' | 'WITHDRAWAL';
  walletId: string;
  amountMinor: string;
}
const hashIdempotencyKey = (input: IdempotencyRequest) => {
  const requestData = JSON.stringify({
    operationType: input.operationType,
    walletId: input.walletId,
    amountMinor: input.amountMinor
  });
  return createHash('sha256').update(requestData).digest('hex');
};

export { hashIdempotencyKey };
