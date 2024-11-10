'use server';

import { signIn } from '@/auth';
import { db, users } from '@/db/schema';
import { AuthError } from 'next-auth';
import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';

export async function authenticate(
  prevState: string | undefined,
  formData: FormData
) {
  try {
    // Ensure the formData contains necessary fields
    const email = formData.get('email')?.toString();
    const password = formData.get('password')?.toString();

    if (!email || !password) {
      return 'Email and password are required.';
    }

    // Attempt to sign in with credentials
    const result = await signIn('credentials', {
      email,
      password,
    });

    if (result?.error) {
      throw new AuthError('CredentialsSignin', result.error);
    }

    return 'Success'; // Or handle success flow appropriately
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
  prevState: string | undefined,
  formData: FormData
) {
  try {
    // Validate formData fields
    const email = formData.get('email')?.toString();
    const password = formData.get('password')?.toString();
    const name = formData.get('name')?.toString();

    if (!email || !password || !name) {
      return 'Name, email, and password are required.';
    }

    // Check if user already exists
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (existingUser.length > 0) {
      return 'Email already in use.';
    }

    // Hash the password before storing it
    const hashedPassword = bcrypt.hashSync(password);

    // Insert new user into the database
    const user = {
      email,
      password: hashedPassword,
      name,
    };

    await db.insert(users).values(user);

    return 'Registration successful'; // Or handle success flow appropriately
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Invalid credentials.';
        default:
          return 'Something went wrong during registration.';
      }
    }
    return 'An unexpected error occurred during registration.';
  }
}
