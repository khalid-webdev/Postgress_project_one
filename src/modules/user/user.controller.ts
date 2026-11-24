import type { RequestHandler } from "express";
import asyncHandler from "../../utils/asyncHandler.js";
import { getMeService } from "./user.service.js";

/* -------------------------- get the current user -------------------------- */
const getMeController:RequestHandler = asyncHandler(async (req, res) => {
  const userId = res.locals.id;
  console.log(typeof userId)
  const result = await getMeService(userId);
  return res.status(200).json({
  success: true,
  data:result
  })
});

export {
  getMeController
}
