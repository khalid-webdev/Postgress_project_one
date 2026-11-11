import "dotenv/config";
import type { SignOptions } from "jsonwebtoken";
import { z } from "zod";

const expiryRegex = /^\d+[smhd]$/;
const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(5000),
  DATABASE_URL: z.url({ error: 'Database_url must be a valid connection' }),
  JWT_ACCESS_SECRET: z.string().min(32, 'Jwt access secret should be at least 32 characters long'),
  JWT_ACCESS_EXPIRY: z.string().regex(expiryRegex,'Must be a valid duration format like 15m, 1h, or 7d').transform((val)=>val as  NonNullable<SignOptions['expiresIn']>)
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error('Invalid enviroment variables');
  console.error(JSON.stringify(parsedEnv.error.format(), null, 2));
  process.exit(1);
}

const env = {
  nodeEnv: parsedEnv.data.NODE_ENV,
  port: parsedEnv.data.PORT,
  dbUrl: parsedEnv.data.DATABASE_URL,
  jwt: {
    accessSecret: parsedEnv.data.JWT_ACCESS_SECRET,
    accessExpiry: parsedEnv.data.JWT_ACCESS_EXPIRY,
  }
} as const;
export default env;
