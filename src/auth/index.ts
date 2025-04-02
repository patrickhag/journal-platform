import { db } from '@/db/db';
import { users } from '@/db/schema';
import logger from '@/lib/logger';
import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';
import NextAuth, { type User, type NextAuthConfig } from 'next-auth';
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

          if (!user) {
            return null;
          }

          const isCorrectPassword = await bcrypt.compare(
            String(credentials.password),
            user.password ?? ''
          );
          if (!isCorrectPassword) {
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
          throw error;
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  },
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
        return {
          ...token,
          id: user.id as string,
          role: user.role,
          email: user.email,
        };
      }
      return token;
    },

    session: ({ session, token }) => {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id as string,
          role: token.role,
          email: token.email,
        },
      };
    },
  },
  pages: {
    signIn: '/login',
    signOut: '/login',
    error: '/login',
  },
  basePath: BASE_PATH,
  secret: process.env.NEXTAUTH_SECRET,
};

export const { handlers, auth, signIn, signOut } = NextAuth(authOptions);
