import { Router } from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import validate from "../middleware/validate.middleware.js";
import { createWalletSchema, transactionAmountSchema, walletIdSchema } from "../validators/wallet.validator.js";
import walletController from "../controllers/wallet.controller.js";
const router = Router();

router.post("/create", authMiddleware, validate(createWalletSchema), walletController.createWallet);
router.get("/", authMiddleware, walletController.getUserWallets);
router.get("/:walletId", authMiddleware, validate(walletIdSchema,'params'), walletController.getWalletById);
router.post("/deposit/:walletId", authMiddleware, validate(walletIdSchema, 'params'), validate(transactionAmountSchema), walletController.dipositeController);
router.post("/withdraw/:walletId", authMiddleware, validate(walletIdSchema, 'params'), validate(transactionAmountSchema), walletController.withdrawController);


export default router;
