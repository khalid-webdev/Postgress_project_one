//return function types:

export type TransactionType = 'DEPOSIT' | 'WITHDRAWAL' | 'TRANSFER_IN' |'TRANSFER_OUT'|'TRANSFER';
export type TransactionStatus = 'PENDING' | 'COMPLETED' | 'FAILED';

//Database entity
export interface TypeTransaction {
  id: string;
  wallet_id: string;
  type: TransactionType;
  amount_minor: string;
  status: TransactionStatus;
  transfer_id: string | null;
  created_at: Date;
}


//model input
export interface InputTransaction {
  walletId: string;
  type: TransactionType;
  amountMinor: string;
  transferId?: string;
  status?: TransactionStatus;
};
