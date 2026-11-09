import PG from "pg";
import "dotenv/config";
const { Pool } = PG;

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

export const initializeDatabase = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users(
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name VARCHAR(100) NOT NULL,
      email VARCHAR(255) NOT NULL UNIQUE,
      created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
    )
  `);
  await pool.query(`
    ALTER TABLE users
    ADD COLUMN IF NOT EXISTS password_hash TEXT
  `);
  console.log("Database initialized!")
};

export const PORT = process.env.PORT || 5001;
