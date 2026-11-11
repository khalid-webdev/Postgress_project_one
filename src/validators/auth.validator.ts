import { z } from 'zod';

const registerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name cannot exceeds 100 characters"),
  email: z.email({error:"Please provide a valid email"}).pipe(z.string().trim().lowercase()),
  password:z.string().min(8,"Password must be at least 8 characters").max(72,"Password cannot exceeds 72 characters")
});

const loginSchema = z.object({
  email: z.email("Please provide a valid email").trim(),
  password: z.string().min(1, "Password is required")
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;

export { registerSchema,loginSchema };
