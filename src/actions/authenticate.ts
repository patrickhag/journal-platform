'use server';

import { signIn } from '@/auth';
import { loginSchema } from '@/schemas/auth.schema';
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
          return error.cause?.err?.message || 'Invalid credentials. Try again!';
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
    case 'STAFF_EDITOR':
      return redirect('/staff-editor/assignments', RedirectType.replace);
    case 'REVIEWER':
      return redirect('/reviewer/assignments', RedirectType.replace);
    case 'ASSOCIATE_EDITOR':
      return redirect('/associate-editor/assignments', RedirectType.replace);
    case 'CHIEF_EDITOR':
    case 'ADMIN':
      return redirect('/editor/dashboard', RedirectType.replace);
    default:
      return redirect('/submissions', RedirectType.replace);
  }
}
