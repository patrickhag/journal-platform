'use server';

import { db, users } from '@/db/schema';
import { registerSchema } from '@/schemas/auth.schema';
import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';
import { AuthError } from 'next-auth';
import type z from 'zod';
import jwt from 'jsonwebtoken';

export async function register(
  _prevState:
    | { message: string; data?: Partial<z.infer<typeof registerSchema>> }
    | undefined,
  formData: z.infer<typeof registerSchema>
) {
  const register = registerSchema.safeParse(formData);
  if (register.error)
    return { message: register.error.errors[0].message, data: formData };
  try {
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, register.data.email))
      .limit(1);

    if (existingUser.length > 0) {
      return { message: 'Email already in use.', data: register.data };
    }

    const hashedPassword = await bcrypt.hash(register.data.password, 10);

    const user = {
      ...register.data,
      password: hashedPassword,
    };

    const createdUser = await db.insert(users).values(user).returning();
    jwt.sign(
      { email: createdUser[0].email, id: createdUser[0].id },
      process.env.NEXTAUTH_SECRET!,
      {
        expiresIn: '7d',
      }
    );
    if (!createdUser[0].email) return;

    return { message: 'Registration successful', data: register.data };
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
    }

    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return { message: 'Invalid credentials. Try again!' };
        default:
          return { message: 'Something went wrong during sign-in.' };
      }
    }
  }
}
