'use server';

import { signIn } from '@/auth';
import { db, users } from '@/db/schema';
import { AuthError } from 'next-auth';
import bcrypt from "bcryptjs";


export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    await signIn('credentials', formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Invalid credentials.';
        default:
          return 'Something went wrong.';
      }
    }
    throw error;
  }
}


export async function register(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    const user = {
      password: bcrypt.hashSync(formData.get('password')?.toString()),
      email: formData.get('email')?.toString(),
      name: formData.get('name')?.toString()
    }
    console.log(user)
    await db.insert(users).values(user)
  } catch (error) {
    if (error instanceof AuthError) {
      console.log("Muslim", error)
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Invalid credentials.';
        default:
          return 'Something went wrong.';
      }
    }
    throw error;
  }
}