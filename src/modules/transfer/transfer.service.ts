import { pool } from '../../config/db.js';

import type { TransferWalletInput } from '../wallet/wallet.types.js';
import type { PoolClient } from 'pg';
import { hashIdempotencyRequest } from '../../utils/hash.idempotency.js';
import { createIdempotencyRecord } from '../idempotency/idempotency.model.js';

const handleTransferIdempotency = async (client:PoolClient,input:TransferWalletInput) => {
  const hashRequest = hashIdempotencyRequest({
    operationType: "TRANSFER",
    senderWalletId: input.senderWalletId,
    receiverWalletId: input.receiverWalletId,
    amountMinor: input.amountMinor
  });

  const newRecord = await createIdempotencyRecord
}
