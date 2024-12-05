import { users } from '@/db/schema';
import { db } from '@/db/drizzle';
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
        email: { label: 'Email', type: 'text', placeholder: 'jsmith' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials): Promise<User | null> {
        if (!credentials?.email || !credentials.password) {
          return null;
        }

        const usersData = await db
          .select()
          .from(users)
          .limit(1)
          .where(eq(users.email, String(credentials.email)));
        const user = usersData[0];

        if (
          !user ||
          !(await bcrypt.compare(String(credentials.password), user.password!))
        ) {
          return null;
        }
        return {
          name: `${user.firstName} ${user.lastName}`,
          email: user.email,
          id: user.id,
        };
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
          id: u.id,
          randomKey: u.randomKey,
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
        },
      };
    },
  },
  basePath: BASE_PATH,
  secret: process.env.NEXTAUTH_SECRET,
};

export const { handlers, auth, signIn } = NextAuth(authOptions);
