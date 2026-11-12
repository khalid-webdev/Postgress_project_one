import { Router } from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import validate from "../middleware/validate.middleware.js";
import { createWalletSchema, walletIdSchema } from "../validators/wallet.validator.js";
import walletController from "../controllers/wallet.controller.js";
const router = Router();

router.post("/create", authMiddleware, validate(createWalletSchema), walletController.createWallet);
router.get("/", authMiddleware, walletController.getUserWallets);
router.get("/:walletId", authMiddleware, validate(walletIdSchema,'params'), walletController.getWalletById);


export default router;
