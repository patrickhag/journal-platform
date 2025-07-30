import { db } from '@/db/db';
import { users } from '@/db/schema';
import logger from '@/lib/logger';
import { eq } from 'drizzle-orm';
import NextAuth, { type User, type NextAuthConfig } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import Google from 'next-auth/providers/google';

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
          const { email, password } = credentials;
          console.log('email, password: ', email, password);
          const user = await getUserFromDb(email as string);
          if (user) {
            return {
              name: `${user?.firstName} ${user?.lastName}`,
              email: user?.email,
              id: user?.id,
              role: user?.role ?? 'NORMAL_USER',
            };
          }
          return null;
        } catch (error) {
          if (error instanceof Error) {
            logger.error(error.message);
          }
          throw error;
        }
      },
    }),
    Google,
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  },
  callbacks: {
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
  basePath: BASE_PATH,
  secret: process.env.NEXTAUTH_SECRET,
};

const getUserFromDb = async (email: string) => {
  try {
    const user = await db.query.users.findFirst({
      columns: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        password: true,
      },
      where: eq(users.email, email),
    });
    return user;
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
    }
  }
};

export const { handlers, auth, signIn, signOut } = NextAuth(authOptions);
