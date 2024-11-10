'use server';

import { signIn } from '@/auth';
import { db, users } from '@/db/schema';
import { AuthError } from 'next-auth';
import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';
import { loginSchema, registerSchema } from '@/schemas/auth.schema';
import { isPasswordMatch } from './helpers';
import z from 'zod'

export async function authenticate(
  prevState: string | undefined,
  formData: FormData
) {
  try {

    const login = loginSchema.safeParse(Object.fromEntries(formData.entries()))
    if (login.error) return login.error.errors[0].message

    const result = await signIn('credentials', login.data);

    if (result?.error) {
      throw new AuthError('CredentialsSignin', result.error);
    }

    return 'Success';
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Invalid credentials.';
        default:
          return 'Something went wrong during sign-in.';
      }
    }
    return 'An unexpected error occurred during authentication.';
  }
}

export async function register(
  prevState: { message: string, data?: Partial<z.infer<typeof registerSchema>> } | undefined,
  formData: FormData
) {
  try {
    const confirmPassword = formData.get('ConfirmPassword')?.toString()
    const register = registerSchema.safeParse(Object.fromEntries(formData.entries()))
    if (register.error) return { message: register.error.errors[0].message, data: Object.fromEntries(formData.entries()) as Partial<z.infer<typeof registerSchema>> }

    if (!confirmPassword || !isPasswordMatch(register.data.password, confirmPassword)) {
      return { message: "password and confirm password don't match", data: register.data }
    }

    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, register.data.email))
      .limit(1);

    if (existingUser.length > 0) {
      return { message: "Email already in use.", data: register.data }
    }

    const hashedPassword = bcrypt.hashSync(register.data.password);

    const user = {
      ...register.data,
      password: hashedPassword,
    };


    await db.insert(users).values(user);
    return { message: "Registration successful", data: register.data }

  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return { message: 'Invalid credentials.' };
        default:
          return { message: 'Something went wrong during registration.' }
      }
    }
    return { message: 'An unexpected error occurred during registration.' }
  }
}
