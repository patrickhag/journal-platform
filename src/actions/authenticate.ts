'use server';

import { signIn } from '@/auth';
import { db } from '@/db/db';
import { users } from '@/db/schema';
import { loginSchema } from '@/schemas/auth.schema';
import { eq } from 'drizzle-orm';
import { AuthError } from 'next-auth';
import { redirect, RedirectType } from 'next/navigation';
import type z from 'zod';

export async function authenticate(
  _prevState: string | undefined,
  formData: z.infer<typeof loginSchema> & { redirect?: string }
) {
  try {
    await signIn('credentials', {
      redirect: false,
      email: formData.email,
      password: formData.password,
      role: formData.role,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return error.cause?.err?.message || 'Invalid email or password';
        default:
          return 'Something went wrong during sign-in.';
      }
    }
    return 'An unexpected error occurred. Please try again.';
  }
  const role = formData.role;
  switch (role) {
    case 'NORMAL_USER':
      return redirect('/submissions', RedirectType.replace);
    case 'ASSOCIATE_EDITOR':
      return redirect('/associate-editor/assigned', RedirectType.replace);
    case 'REVIEWER':
      return redirect('/reviewer', RedirectType.replace);
    case 'CHIEF_EDITOR':
    case 'ADMIN':
      return redirect('/editor/dashboard', RedirectType.replace);
    default:
      return redirect('/submissions', RedirectType.replace);
  }
}
