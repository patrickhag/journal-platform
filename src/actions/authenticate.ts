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
  try {
    if (login.error) return login.error.errors[0].message;
    await signIn('credentials', {
      redirect: false,
      ...login.data,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Invalid email or password';
        default:
          return 'Something went wrong during sign-in.';
      }
    }
    return 'An unexpected error occurred. Please try again.';
  }
  const user = await db.query.users.findFirst({
    where: eq(users.email, login?.data?.email as string),
  });

  if (user?.role === 'CHIEF_EDITOR' || user?.role === 'ADMIN') {
    return redirect('/editor/articles', RedirectType.replace);
  } else {
    return redirect('/submissions', RedirectType.replace);
  }
}
