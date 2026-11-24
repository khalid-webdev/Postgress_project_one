import type { LoginInput, RegisterInput } from "./auth.validation.js";
import asyncHandler from "../../utils/asyncHandler.js";
import type { RequestHandler } from "express";
import { loginUserService, registerUserService } from "./auth.service.js";

/* --------------------------- register controller -------------------------- */
const registerController = asyncHandler(async (req, res) => {
  const input = req.body as RegisterInput;
  const user = await registerUserService(input);
  return res.status(201).json({
    success: true,
    message: "User registered successfully",
    data: { user }
  });
});

/* ---------------------------- login controller ---------------------------- */
const loginController: RequestHandler = asyncHandler(async (req, res) => {
  const { email, password } = req.body as LoginInput;

  const user = await loginUserService(email, password);

  return res.status(200).json({
    success: true,
    message: "Login successful",
    data: {
      user: user.user,
      accessToken: user.accessToken
    },
  })
});


export {
  registerController,
  loginController
}
