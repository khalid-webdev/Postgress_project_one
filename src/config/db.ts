import PG from "pg";
import "dotenv/config";
const { Pool } = PG;


export const PORT = process.env.PORT || 5001;

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

  await pool.query(`
    CREATE TABLE IF NOT EXISTS wallets(
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
      balance_minor BIGINT NOT NULL DEFAULT 0,
      currency VARCHAR(3) NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

      CONSTRAINT wallets_balance_nonnegative CHECK(balance_minor >= 0),
      CONSTRAINT wallets_curency_format CHECK(currency ~ '^[A-Z]{3}$'),
      CONSTRAINT wallets_user_currency_unique UNIQUE(user_id,currency)
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS transactions(
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      wallet_id UUID NOT NULL REFERENCES wallets(id) ON DELETE RESTRICT,
      type VARCHAR(20) NOT NULL,
      amount_minor BIGINT NOT NULL,
      status VARCHAR(20) NOT NULL DEFAULT 'COMPLETED',
      created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP

      CONSTRAINT transactions_type_check CHECK(type IN ('DIPOSIT','WITHDRAWAL','TRANSFER')),
      CONSTRAINT transactions_amount_nonnegative CHECK(amount_minor > 0),
      CONSTRAINT transactions_status_check CHECK(status IN ('PENDING','COMPLETED','FAILED'))
      )
  `);

  console.log("Database initialized to postgres_learning!")
};
