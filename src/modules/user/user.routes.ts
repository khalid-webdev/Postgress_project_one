import { Router } from "express";
import authMiddleware from "../../middleware/auth.middleware.js";
import { getMeController } from "./user.controller.js";

const router = Router();


router.get("/me", authMiddleware, getMeController);



export default router;
