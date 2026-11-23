
import type { RequestHandler } from "express";
import walletService from "../wallet/wallet.service.js";
import asyncHandler from "../../utils/asyncHandler.js";
import type { InputTransactionAmount } from "./wallet.validator.js";
import AppError from "../../utils/AppError.js";

/* ------------------------ create wallets controller ----------------------- */
const createWallet = asyncHandler(async (req, res, _next) => {
  const userId = res.locals.id;
  const { currency } = req.body;
  const result = await walletService.createWallet(userId, currency);

  return res.status(201).json({
    success: true,
    message: "Wallet created successfully",
    data: result
  })
});


/* -------------------------- get all users wallets ------------------------- */
const getUserWallets = asyncHandler(async (_req, res, _next) => {
  const userId = res.locals.id;
  const results = await walletService.getUserWallets(userId);
  return res.status(200).json({
    success: true,
    message: results.length > 0 ? 'Wallets retrieved successfully' : "You haven't created any wallet",
    data: results
  });
});

/* -------------------------- get wallet by it's id ------------------------- */
const getWalletById = asyncHandler(async (req, res) => {
  const userId = res.locals.id;
  const walletId = req.params.walletId as string;

  const result = await walletService.getWalletById(userId, walletId);
  return res.status(200).json({
    success: true,
    message: "Wallet retrieved successfully!",
    data: {
      result
    }
  });
})

/* --------------------------- diposite to wallets -------------------------- */
const dipositeController: RequestHandler = asyncHandler(async (req, res) => {
  const userId = res.locals.id;
  const walletId = req.params.walletId as string;
  const { amountMinor } = req.body as InputTransactionAmount;
  const idempotencyKey = req.get("Idempotency-Key")?.trim();
  if (!idempotencyKey || idempotencyKey.length > 255) {
    throw new AppError(409,"Valid idempotency key header is required")
  }
  const result = await walletService.dipositToWallet(userId, walletId, amountMinor,idempotencyKey);

  return res.status(200).json({
    success: true,
    message: "Diposit successfull",
    data: result
  });

});

const withdrawController = asyncHandler(async (req, res) => {
  const userId = res.locals.id;
  const walletId = req.params.walletId as string;
  const { amountMinor } = req.body as InputTransactionAmount;
  const idempotencyKey = req.get("Idempotency-Key")?.trim();
  if (!idempotencyKey || idempotencyKey.length > 255) {
    throw new AppError(400, "A valid Idempotency-Key header is required");
  }
  const result = await walletService.withdrawFromWallet(userId, walletId,amountMinor,idempotencyKey);

  return res.status(200).json({
    success: true,
    message: "Withdraw from wallet successfull",
    data: result
  });
})
export default {
  createWallet,
  getUserWallets,
  getWalletById,
  dipositeController,
  withdrawController
}
