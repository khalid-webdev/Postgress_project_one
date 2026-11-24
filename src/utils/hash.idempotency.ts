import { createHash } from "node:crypto";

type IdempotencyRequest =
  | {
    operationType: 'DEPOSIT' | 'WITHDRAWAL';
    walletId: string;
    amountMinor: string;
  }
  | {
    operationType: 'TRANSFER';
    senderWalletId: string;
    receiverWalletId: string;
    amountMinor: string;
  };
const hashIdempotencyRequest = (input: IdempotencyRequest):string => {
  const requestData = input.operationType === "TRANSFER" ? {
    operationType: input.operationType,
    senderWalletId: input.senderWalletId,
    receiverWalletId: input.receiverWalletId,
    amountMinor:input.amountMinor
  } : {
      operationType: input.operationType,
      walletId: input.walletId,
      amountMinor: input.amountMinor
  };
  return createHash('sha256').update(JSON.stringify(requestData)).digest('hex');
};

export { hashIdempotencyRequest };
