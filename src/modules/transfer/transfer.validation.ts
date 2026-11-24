import { z } from "zod";


const transferWalletSchema = z.object({
  senderWalletId: z.uuid("Invalid sender wallet id"),
  receiverWalletId: z.uuid("Invalid receiver walletId"),
  amountMinor:z.string().regex(/^[1-9]\d*$/,'Amount must be positive integer').pipe(z.string().refine((value)=>BigInt(value) <= 1000000000000n,"Amount is too large"))
});

export type TransferWalletRequest = z.infer<typeof transferWalletSchema>;

export {
  transferWalletSchema
};
