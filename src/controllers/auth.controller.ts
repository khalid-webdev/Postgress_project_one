import type { RegisterInput } from "../validators/auth.validator.js";
import authService from "../services/auth.service.js";
import asyncHandler from "../utils/asyncHandler.js";

const registerController = asyncHandler(async(req,res) => {
  const input =req.body as RegisterInput;
  const user = await authService.registerUser(input);
  return res.status(201).json({
    success: true,
    message: "User registered successfully",
    data: { user }
  });
})
export default {
  registerController
}
