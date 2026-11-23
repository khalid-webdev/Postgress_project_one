import { pool } from "../../config/db.js";
import type { CreateUserInput, User } from "./user.types.js";



// find the user by email
const findUserByEmail = async (email: string) => {
  const sql = `
    SELECT id, name,email,password_hash,created_at
    FROM users
    WHERE email = $1
  `;
  const user = await pool.query(sql, [email]);
  return user.rows[0] ?? null;
};

const createUser = async (input: CreateUserInput): Promise<User | null> => {
  const sql = `
    INSERT INTO users(name,email,password_hash)
    VALUES ($1,$2,$3)
    RETURNING id,name,email,created_at;
  `;
  const result = await pool.query<User>(sql, [input?.name, input?.email, input.passwordHash]);
  return result.rows[0] ?? null;
};

const findUserById =async (userId: string)=> {
  const sql = `SELECT id,name,email,created_at FROM users WHERE id = $1`;
  const result = await pool.query<User>(sql, [userId]);
  return result.rows[0] ?? null
}



export {
  findUserByEmail,
  createUser,
  findUserById
}
