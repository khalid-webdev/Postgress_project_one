import { createUser, findUserByEmail, findUserById } from "../models/User.js";
import AppError from "../utils/AppError.js";
import { generateAccessToken } from "../utils/jwt.js";
import { comparePassword, hashPassword } from "../utils/password.js";

type RegisterInput = {
  name: string;
  email: string;
  password: string;
}

//^* --------------------------- register user --------------------------- */
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
    console.log('error', error)
    if (typeof error === 'object' && error !== null && "code" in error && error.code === "23505") {
      throw new AppError(409,"Email is already registered")
    }
    throw error;
  }
}

//* ------------------------------- login user ------------------------------- */
const loginUser = async (email:string,password:string) => {
  const normalizeEmail = email.trim().toLocaleLowerCase();
  const user = await findUserByEmail(normalizeEmail);
  if (!user) {
    throw new AppError(401, "Invalid email or password");
  }
  const isMatch = await comparePassword(password, user.password_hash);
  if (!isMatch) {
    throw new AppError(401, "Invalid email or password");
  }
  const accessToken = generateAccessToken(user.id);

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      created_at:user.created_at
    },
    accessToken
  }
}

//* ---------------------------- get current user ---------------------------- */
const getMe = async (userId: string) => {

  const user = await findUserById(userId);

  if (!user) throw new AppError(404, "User not found!");

  return user;
}





export default {
  registerUser,
  loginUser,
  getMe
};
