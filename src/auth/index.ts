import { db } from '@/db/db';
import { users } from '@/db/schema';
import logger from '@/lib/logger';
import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';
import NextAuth, { type User, type NextAuthConfig } from 'next-auth';
import type { AdapterUser } from 'next-auth/adapters';
import Credentials from 'next-auth/providers/credentials';

export const BASE_PATH = '/api/auth';

export const authOptions: NextAuthConfig = {
  providers: [
    Credentials({
      name: 'Credentials',
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials): Promise<User | null> {
        try {
          if (!credentials?.email || !credentials.password) {
            return null;
          }

          const user = await db.query.users.findFirst({
            where: eq(users.email, String(credentials.email)),
          });

          const isCorrectPassword = await bcrypt.compare(
            String(credentials.password),
            user?.password ?? ''
          );

          if (!user || !isCorrectPassword) {
            return null;
          }

          return {
            name: `${user.firstName} ${user.lastName}`,
            email: user.isActive ? user.email : '',
            id: user.id,
            role: user.role ?? 'NORMAL_USER',
          };
        } catch (error) {
          if (error instanceof Error) {
            logger.error(error.message);
          }
          return null;
        }
      },
    }),
  ],
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const paths = ['/profile', '/client-side', '/api/session'];
      const isProtected = paths.some((path) =>
        nextUrl.pathname.startsWith(path)
      );

      if (isProtected && !isLoggedIn) {
        const redirectUrl = new URL('/login', nextUrl.origin);
        redirectUrl.searchParams.append('callbackUrl', nextUrl.href);
        return Response.redirect(redirectUrl);
      }
      return true;
    },
    jwt: ({ token, user }) => {
      if (user) {
        const u = user as (User | AdapterUser) & { randomKey: string };
        return {
          ...token,
          id: u.id as string,
          randomKey: u.randomKey,
          role: u.role,
          email: u.email,
        };
      }
      return token;
    },
    session(params) {
      return {
        ...params.session,
        user: {
          ...params.session.user,
          id: params.token.id as string,
          randomKey: params.token.randomKey,
          role: params.token.role,
          email: params.token.email,
        },
      };
    },
  },
  basePath: BASE_PATH,
  secret: process.env.NEXTAUTH_SECRET,
};

export const { handlers, auth, signIn } = NextAuth(authOptions);
