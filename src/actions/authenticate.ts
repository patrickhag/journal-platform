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
  const login = loginSchema.safeParse(formData);
  if (login.error) return login.error.errors[0].message;
  try {
    await signIn('credentials', {
      redirect: false,
      ...login.data,
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
  const user = await db.query.users.findFirst({
    where: eq(users.email, login?.data?.email as string),
  });

  switch (user?.role) {
    case 'NORMAL_USER':
      return redirect('/submissions', RedirectType.replace);
    case 'REVIEWER':
      return redirect('/reviewer', RedirectType.replace);
    case 'CHIEF_EDITOR':
    case 'ADMIN':
      return redirect('/editor/dashboard', RedirectType.replace);
    default:
      return redirect('/submissions', RedirectType.replace);
  }
}
