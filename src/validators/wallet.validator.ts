import z from "zod";

const createWalletSchema = z.object({
  currency: z
    .string()
    .trim()
    .length(3, "Currency must contain exactly 3 characters")
    .regex(/^[A-Za-z]{3}$/, "Invalid currency format")
    .transform((value) => value.toUpperCase()),
});

export type InputCreateWallet = z.infer<typeof createWalletSchema>

export {
  createWalletSchema
}
