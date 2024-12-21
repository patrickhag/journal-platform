'use server';

import { signIn } from '@/auth';
import { db, users } from '@/db/schema';
import { registerSchema } from '@/schemas/auth.schema';
import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';
import { AuthError } from 'next-auth';
import { redirect, RedirectType } from 'next/navigation';
import type z from 'zod';
import jwt from 'jsonwebtoken';
import { sendVerifyToken } from '@/lib/emailTransporter';
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

    const hashedPassword = bcrypt.hashSync(register.data.password);

    const user = {
      ...register.data,
      password: hashedPassword,
    };

    console.log('passedUser>>>', user)

    const createdUser = await db.insert(users).values(user).returning();
    const token = jwt.sign(
      { email: createdUser[0].email, id: createdUser[0].id },
      process.env.AUTH_SECRET!,
      {
        expiresIn: '1d',
      }
    );
    if (!createdUser[0].email) return;

    console.log(createdUser);

    await sendVerifyToken({ email: createdUser[0].email, token: token });

    await signIn('credentials', {
      email: register.data.email,
      password: register.data.password,
    });
    
    // return { message: 'Registration successful', data: register.data };
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message)
    }
    // if (error instanceof AuthError) {
    //   switch (error.type) {
    //     case 'CredentialsSignin':
    //       return { message: 'Invalid credentials.' };
    //     default:
    //       return { message: 'Something went wrong during registration.' };
    //   }
    // }
    // return { message: 'An unexpected error occurred during registration.' };

    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return { message: 'Invalid credentials. Try again!' };
        default:
          return { message: 'Something went wrong during sign-in.' };
      }
    }

  //   const user = await db
  //     .select()
  //     .from(users)
  //     .where(eq(users.email, register.data.email))
  //     .limit(1);
  //   if (user[0].role === 'CHIEF_EDITOR' || user[0].role === 'ADMIN') {
  //     redirect('/editor', RedirectType.replace);
  //   } else {
  //     redirect('/submissions', RedirectType.replace);
  //   }
  }
}
