import Wallet from "../models/Wallet.js"
import AppError from "../utils/AppError.js";

const createWallet = async (userId: string, currency: string) => {
  try {
    const wallet = await Wallet.createWallet(userId, currency);
    return wallet;
  } catch (error) {
    if (typeof error === "object" && error !== null && 'code' in error && error.code === '23505') {
      throw new AppError(409, `You already have a ${currency} wallet`);
    }
    throw error;
  }
};

const getUserWallets = async (userId: string) => {
  const wallets = await Wallet.getWalletsByUserId(userId);
  return wallets;
}
const getWalletById = async (userId: string, walletId: string) => {

  const wallet = await Wallet.getWalletById(userId, walletId);
  console.log("wallets---------------",wallet)
  if (!wallet) {
    throw new AppError(404, "Wallet not found!");
  }
  return wallet;

}

export default {
  createWallet,
  getUserWallets,
  getWalletById
}
