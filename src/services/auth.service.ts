import { createUser, findUserByEmail } from "../models/User.js";
import AppError from "../utils/AppError.js";
import { hashPassword } from "../utils/password.js";

type RegisterInput = {
  name: string;
  email: string;
  password: string;
}
const registerUser = async (input:RegisterInput) => {
  const { name, email, password } = input;
  const existingUser = await findUserByEmail(email);

  if (existingUser) {
    throw new AppError(409,"Email already registered.");
  };

  const passwordHash = await hashPassword(password);
  try {


  const newUser = await createUser({
    name,
    email,
    passwordHash: passwordHash
  });
    return { user: newUser };

  } catch (error) {
    // 4. Handle PostgreSQL unique constraint
    if (typeof error === 'object' && error !== null && "code" in error && error.code === "23505") {
      throw new AppError(409,"Email is already registered")
    }
    throw error;
  }
}

export default {
  registerUser
};
