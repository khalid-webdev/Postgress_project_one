import jwt from "jsonwebtoken";
import env from "../config/env.js";


const generateAccessToken = (userId: string): string => {
  return jwt.sign(
    { sub: userId },
    env.jwt.accessSecret,
    { expiresIn: env.jwt.accessExpiry }
  )
};

const verifyAccessToken = (token: string) => {
  return jwt.verify(token, env.jwt.accessSecret);
};


export {
  generateAccessToken,
  verifyAccessToken
}
