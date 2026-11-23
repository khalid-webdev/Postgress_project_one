import z from "zod";

const createWalletSchema = z.object({
  currency: z
    .string()
    .trim()
    .length(3, "Currency must contain exactly 3 characters")
    .regex(/^[A-Za-z]{3}$/, "Invalid currency format")
    .transform((value) => value.toUpperCase()),
});

const walletIdSchema = z.object({
  walletId: z.string().uuid({ error: "Invalid wallet id" }),
});


const transactionAmountSchema = z.object({
  amountMinor: z.string()
    .regex(/^[1-9]\d*$/, "Amount must be a positive initeger")
    .pipe(
      z.string().refine((value) => BigInt(value) <= 1000000000000n,
        "Amount is too large"
      )
    ),
}).strict()

export type InputTransactionAmount = z.infer<typeof transactionAmountSchema>;
export type InputCreateWallet = z.infer<typeof createWalletSchema>;

export {
  createWalletSchema,
  walletIdSchema,
  transactionAmountSchema
}
