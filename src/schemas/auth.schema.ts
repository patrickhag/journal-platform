import { COUNTRIES } from '@/lib/consts';
import * as z from 'zod';

export const loginSchema = z.object({
  email: z
    .string({ required_error: 'Email is required' })
    .min(1, 'Email is required')
    .email('Invalid email'),
  password: z
    .string({ required_error: 'Password is required' })
    .min(8, 'Password must be more than 8 characters')
    .max(32, 'Password must be less than 32 characters')
    .refine(
      (val) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/.test(val ?? ''),
      {
        message:
          'Must include uppercase, lowercase, number, and special character',
      }
    ),
  role: z.string().min(3, { message: 'Select Role is required' }),
});

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(5, { message: 'Email is invalid' })
    .max(50, { message: 'Email is too long' })
    .email({ message: 'Invalid email' }),
  password: z
    .string()
    .refine(
      (val) =>
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
          val ?? ''
        ),
      'Minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character'
    ),
});

export const registerSchema = z
  .object({
    affiliation: z.string().min(2, { message: 'Affiliation is required' }),
    firstName: z
      .string()
      .min(2, { message: 'first name are required' })
      .max(100, { message: 'Your name are too long' }),
    lastName: z
      .string()
      .min(2, { message: 'last name should be at least 5 characters long' })
      .max(100, { message: 'last name should not exceed 10 characters long' }),
    email: z
      .string()
      .min(5, { message: 'Email is invalid' })
      .max(50, { message: 'Email is too long' })
      .email({ message: 'Invalid email' }),
    country: z.enum(COUNTRIES, { message: 'country is required' }),
    acceptTerms: z.boolean().refine((val) => val === true, {
      message: 'You must accept terms and conditions',
    }),
    password: z
      .string()
      .refine(
        (val) =>
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
            val ?? ''
          ),
        'Minimum characters at least one uppercase letter, one lowercase letter, one number and one special character'
      ),
    confirmPassword: z
      .string()
      .refine(
        (val) =>
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
            val ?? ''
          ),
        "Password don't match"
      ),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });
