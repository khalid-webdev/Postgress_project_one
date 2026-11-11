import { Router } from "express";
import validate from "../middleware/validate.middleware.js";
import { loginSchema, registerSchema } from "../validators/auth.validator.js";
import authController from "../controllers/auth.controller.js";
const router = Router();

router.post("/register", validate(registerSchema), authController.registerController);
router.post("/login", validate(loginSchema), authController.loginController);


export default router;
