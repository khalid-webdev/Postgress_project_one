import AppError from "../../utils/AppError.js";
import { findUserById } from "./user.model.js";

//* ---------------------------- get current user ---------------------------- */
export const getMeService = async (userId: string) => {

  const user = await findUserById(userId);

  if (!user) throw new AppError(404, "User not found!");

  return user;
}
