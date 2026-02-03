import { z } from 'zod';

export const loginSchema = z.object({
  phone: z.string().min(10, "Phone number must be at least 10 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const authResponseSchema = z.object({
  token: z.string(),
});
