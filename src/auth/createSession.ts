'use server';

import { db } from '@/db/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { redirect, RedirectType } from 'next/navigation';
import { cache } from 'react';

type SessionPayload = {
  userId: string;
  expiresAt: Date;
  userRole: string;
};

const secretKey = process.env.SECRET;
const key = new TextEncoder().encode(secretKey);

export async function encrypt(payload: SessionPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('1hr')
    .sign(key);
}

export async function createSession({
  userId,
  userRole,
}: {
  userId: string;
  userRole: string;
}) {
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000);
  const session = await encrypt({ userId, userRole, expiresAt });

  const cookieStore = await cookies();

  cookieStore.set('session', session, {
    httpOnly: true,
    secure: true,
    expires: expiresAt,
    sameSite: 'lax',
    path: '/',
  });

  switch (userRole) {
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

export async function decrypt(session: string | undefined = '') {
  try {
    const { payload } = await jwtVerify(session, key, {
      algorithms: ['HS256'],
    });
    return payload;
  } catch (error) {
    return null;
  }
}

export async function verifySession() {
  const cookieStore = await cookies();

  const cookie = cookieStore.get('session')?.value;
  const session = await decrypt(cookie);

  if (!session?.userId) {
    redirect('/login');
  }

  return { isAuth: true, userId: String(session.userId) };
}

export const getUser = cache(async () => {
  const session = await verifySession();
  if (!session) return null;

  try {
    const data = await db.query.users.findMany({
      where: eq(users.id, session.userId),
      columns: {
        id: true,
        email: true,
        role: true,
        firstName: true,
        lastName: true,
      },
    });

    const user = data[0];

    return user;
  } catch (error) {
    console.log('Failed to fetch user');
    return null;
  }
});
