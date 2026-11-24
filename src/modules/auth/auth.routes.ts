import { Router } from "express";
import validate from "../../middleware/validate.middleware.js";
import { loginSchema, registerSchema } from "./auth.validation.js";
import { loginController, registerController } from "./auth.controller.js";

const router = Router();

router.post("/register", validate(registerSchema), registerController);
router.post("/login", validate(loginSchema), loginController);


export default router;
