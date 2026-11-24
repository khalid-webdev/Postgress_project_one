
import type { RequestHandler } from "express";
import asyncHandler from "../../utils/asyncHandler.js";
import type { InputTransactionAmount } from "./wallet.validator.js";
import AppError from "../../utils/AppError.js";
import { createWalletService, depositToWalletService, getUserWalletsService, getWalletByIdService, withdrawFromWalletService } from "./wallet.service.js";

/* ------------------------ create wallets controller ----------------------- */
const createWalletController = asyncHandler(async (req, res, _next) => {
  const userId = res.locals.id;
  const { currency } = req.body;
  const result = await createWalletService(userId, currency);

  return res.status(201).json({
    success: true,
    message: "Wallet created successfully",
    data: result
  })
});


/* -------------------------- get all users wallets ------------------------- */
const getUserWalletsController = asyncHandler(async (_req, res, _next) => {
  const userId = res.locals.id;
  const results = await getUserWalletsService(userId);
  return res.status(200).json({
    success: true,
    message: results.length > 0 ? 'Wallets retrieved successfully' : "You haven't created any wallet",
    data: results
  });
});

/* -------------------------- get wallet by it's id ------------------------- */
const getWalletByIdController = asyncHandler(async (req, res) => {
  const userId = res.locals.id;
  const walletId = req.params.walletId as string;

  const result = await getWalletByIdService(userId, walletId);
  return res.status(200).json({
    success: true,
    message: "Wallet retrieved successfully!",
    data: {
      result
    }
  });
})

/* --------------------------- diposite to wallets -------------------------- */
const depositeController: RequestHandler = asyncHandler(async (req, res) => {
  const userId = res.locals.id;
  const walletId = req.params.walletId as string;
  const { amountMinor } = req.body as InputTransactionAmount;
  const idempotencyKey = req.get("Idempotency-Key")?.trim();
  if (!idempotencyKey || idempotencyKey.length > 255) {
    throw new AppError(409,"Valid idempotency key header is required")
  }
  const result = await depositToWalletService(userId, walletId, amountMinor,idempotencyKey);

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
  const result = await withdrawFromWalletService(userId, walletId,amountMinor,idempotencyKey);

  return res.status(200).json({
    success: true,
    message: "Withdraw from wallet successfull",
    data: result
  });
})
export {
  createWalletController,
  getUserWalletsController,
  getWalletByIdController,
  depositeController,
  withdrawController
}
