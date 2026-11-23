//Database entity
export interface Wallet {
  id: string;
  user_id: string;
  currency: string;
  balance_minor: string;
  created_at: Date;
  updated_at: Date;
}


//service input
export interface TransferWalletInput{
  senderWalletId: string;
  receiverWalletId: string;
  userId: string;
  amountMinor: string;
  idempotencyKey: string;
}
