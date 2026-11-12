import type { RequestHandler } from "express";
import walletService from "../services/wallet.service.js";
import asyncHandler from "../utils/asyncHandler.js";

/* ------------------------ create wallets controller ----------------------- */
const createWallet = asyncHandler(async (req, res, next) => {
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
const getUserWallets = asyncHandler(async (req, res, next) => {
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


export default {
  createWallet,
  getUserWallets,
  getWalletById
}
