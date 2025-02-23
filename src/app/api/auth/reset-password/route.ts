import { passwordResets, users } from '@/db/schema';
import { db } from '@/db/db';
import { RESET_PASSWORD_EXPIRATION_TIME } from '@/lib/consts';
import { eq } from 'drizzle-orm';
import { redirect } from 'next/navigation';
import type { NextRequest } from 'next/server';

export const GET = async (request: NextRequest) => {
  const url = new URL(request.url);
  const searchParams = url.searchParams;
  const token = searchParams.get('id');

  if (!token) redirect('/login');

  const data = await db.query.passwordResets.findFirst({
    where: eq(passwordResets.token, token),
  });

  const userRequest = data;

  if (!userRequest) {
    return redirect('/forgot-password?msg=Invalid or expired token');
  }

  const expirationTime = userRequest.expires.getTime();
  if (expirationTime < Date.now() - RESET_PASSWORD_EXPIRATION_TIME) {
    return redirect(
      '/forgot-password?msg=Token has expired. Please request again'
    );
  }

  await db.update(users).set({ password: userRequest.password }).execute();
  return redirect('/login');
};
