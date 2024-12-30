'use server';

import { signIn } from '@/auth';
import { db, users } from '@/db/schema';
import { loginSchema } from '@/schemas/auth.schema';
import { eq } from 'drizzle-orm';
import { AuthError } from 'next-auth';
import type z from 'zod';
import { redirect, RedirectType } from 'next/navigation';

export async function authenticate(
  _prevState: string | undefined,
  formData: z.infer<typeof loginSchema> & { redirect?: string }
) {
  const login = loginSchema.safeParse(formData);
  try {
    if (login.error) return login.error.errors[0].message;
    await signIn('credentials', login.data);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Invalid credentials. Try again!';
        default:
          return 'Something went wrong during sign-in.';
      }
    }
    if (formData.redirect) {
      return redirect(formData.redirect, RedirectType.replace);
    }
    const user = await db
      .select()
      .from(users)
      .where(eq(users.email, login?.data?.email as string))
      .limit(1);
    if (user[0].role === 'CHIEF_EDITOR' || user[0].role === 'ADMIN') {
      redirect('/editor/articles', RedirectType.replace);
    } else {
      redirect('/submissions', RedirectType.replace);
    }
  }
}
