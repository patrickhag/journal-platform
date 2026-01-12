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

  try {
    const decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET!) as {
      id: string;
      exp: number;
    };

    const expirationTime = new Date(decoded.exp * 1000).getTime();
    if (expirationTime < Date.now() - RESET_PASSWORD_EXPIRATION_TIME) {
      redirect('/login', RedirectType.replace);
    }

    await db
      .update(users)
      .set({
        emailVerified: new Date(),
        isActive: true,
      })
      .where(eq(users.id, decoded.id))
      .execute();

    // Redirect with success parameter to show thank you message
    redirect('/login?verified=true', RedirectType.replace);
  } catch (err) {
    // Token verification failed
    redirect('/login', RedirectType.replace);
  }
};
