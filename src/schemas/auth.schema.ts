import { COUNTRIES } from '@/lib/consts';
import * as z from 'zod';

export const loginSchema = z.object({
  email: z
    .string()
    .min(5, { message: 'Email is invalid' })
    .max(50, { message: 'Email is too long' })
    .email({ message: 'Invalid email' }),
  password: z
    .string()
    .min(1, { message: 'Password is required' })
    .max(100, 'Too long'),
});

export const registerSchema = z.object({
  affiliation: z
    .string()
    .min(2, { message: 'affiliation are required' })
    .max(50, { message: 'affiliation are too long' }),
  firstName: z
    .string()
    .min(2, { message: 'first name are required' })
    .max(50, { message: 'Your name are too long' }),
  lastName: z
    .string()
    .min(5, { message: 'last name should be at least 5 characters long' })
    .max(10, { message: 'last name should not exceed 10 characters long' }),
  email: z
    .string()
    .min(5, { message: 'Email is invalid' })
    .max(50, { message: 'Email is too long' })
    .email({ message: 'Invalid email' }),
  country: z.string()
    .max(20, { message: 'country is invalid' })
    .min(3, { message: 'country is invalid' }),
    // .refine((c) => COUNTRIES.includes(c), { message: 'country is invalid' }),
  password: z
    .string({ required_error: 'Password is required' })
    .min(6, { message: 'Minimum 6 characters required' })
    .max(100, { message: 'Password is too long' }),
});
