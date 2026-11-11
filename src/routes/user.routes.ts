import { Router } from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import authController from "../controllers/auth.controller.js";
const router = Router();


router.get("/me", authMiddleware, authController.getMe);



export default router;
