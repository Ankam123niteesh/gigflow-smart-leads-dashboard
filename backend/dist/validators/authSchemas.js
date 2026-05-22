import { z } from 'zod';
const passwordSchema = z.string().min(8, 'Password must be at least 8 characters long');
export const registerSchema = z.object({
    body: z.object({
        name: z.string().min(2, 'Name is required'),
        email: z.string().email('Enter a valid email'),
        password: passwordSchema,
        role: z.enum(['Admin', 'Sales User']).optional(),
    }),
});
export const loginSchema = z.object({
    body: z.object({
        email: z.string().email('Enter a valid email'),
        password: z.string().min(1, 'Password is required'),
    }),
});
