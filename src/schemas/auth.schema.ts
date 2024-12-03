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
    affiliation: z.string(),
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
