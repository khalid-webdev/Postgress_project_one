import type { LoginInput, RegisterInput } from "../validators/auth.validator.js";
import authService from "../services/auth.service.js";
import asyncHandler from "../utils/asyncHandler.js";
import type { RequestHandler } from "express";

/* --------------------------- register controller -------------------------- */
const registerController = asyncHandler(async (req, res) => {
  const input = req.body as RegisterInput;
  const user = await authService.registerUser(input);
  return res.status(201).json({
    success: true,
    message: "User registered successfully",
    data: { user }
  });
});

/* ---------------------------- login controller ---------------------------- */
export const loginController: RequestHandler = asyncHandler(async (req, res) => {
  const { email, password } = req.body as LoginInput;

  const user = await authService.loginUser(email, password);

  return res.status(200).json({
    success: true,
    message: "Login successful",
    data: {
      user: user.user,
      accessToken: user.accessToken
    },
  })
});

/* -------------------------- get the current user -------------------------- */
const getMe:RequestHandler = asyncHandler(async (req, res) => {
  const userId = res.locals.id;
  console.log(typeof userId)
  const result = await authService.getMe(userId);
  return res.status(200).json({
  success: true,
  data:result
  })
});


export default {
  registerController,
  loginController,
  getMe
}
