import { Router } from "express";
import authMiddleware from "../../middleware/auth.middleware.js";
import validate from "../../middleware/validate.middleware.js";
import { createWalletSchema, transactionAmountSchema, walletIdSchema } from "./wallet.validator.js";
import { createWalletController, depositeController, getUserWalletsController, getWalletByIdController, withdrawController } from "./wallet.controller.js";
const router = Router();

router.post("/create", authMiddleware, validate(createWalletSchema), createWalletController);
router.get("/", authMiddleware, getUserWalletsController);
router.get("/:walletId", authMiddleware, validate(walletIdSchema,'params'), getWalletByIdController);
router.post("/deposit/:walletId", authMiddleware, validate(walletIdSchema, 'params'), validate(transactionAmountSchema), depositeController);
router.post("/withdraw/:walletId", authMiddleware, validate(walletIdSchema, 'params'), validate(transactionAmountSchema), withdrawController);


export default router;
