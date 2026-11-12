import type { RequestHandler } from "express"
import AppError from "../utils/AppError.js";
import { verifyAccessToken } from "../utils/jwt.js";

const authMiddleware: RequestHandler = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new AppError(401, "Authentication token is required!")
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    throw new AppError(401, "Invalid Token Format!")
  };
  try {
    const decode = verifyAccessToken(token);
    res.locals.id = decode.sub;
    next();
  } catch (error) {
    throw new AppError(401, "Invalid or expired Authentication token")
  }

}

export default authMiddleware;
