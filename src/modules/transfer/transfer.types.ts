export interface InputTransferWallet {
  senderWalletId: string;
  receiverWalletId: string;
  userId: string;
  amountMinor: string;
  idempotencyKey: string;
}
