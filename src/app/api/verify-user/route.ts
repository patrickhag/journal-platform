import { db, users } from '@/db/schema';
import { RESET_PASSWORD_EXPIRATION_TIME } from '@/lib/consts';
import { eq } from 'drizzle-orm';
import { redirect, RedirectType } from 'next/navigation';
import type { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

export const GET = async (request: NextRequest) => {
  const url = new URL(request.url);
  const searchParams = url.searchParams;
  const token = searchParams.get('id');
  if (!token) {
    redirect('/login', RedirectType.replace);
  }
  jwt.verify(token, process.env.AUTH_SECRET!, async (err, decoded) => {
    if (err) {
      redirect('/login', RedirectType.replace);
    }
    const user = decoded as { id: string; exp: number };
    console.log(decoded, err, user);

    const expirationTime = new Date(user.exp * 1000).getTime();
    if (expirationTime < Date.now() - RESET_PASSWORD_EXPIRATION_TIME) {
      redirect('/login', RedirectType.replace);
    }

    await db
      .update(users)
      .set({ emailVerified: new Date() })
      .where(eq(users.id, user.id))
      .execute();
    redirect('/login', RedirectType.replace);
  });
  redirect('/login', RedirectType.replace);
};
