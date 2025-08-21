import { db } from '@/db/db';
import { users } from '@/db/schema';
import logger from '@/lib/logger';
import bcrypt from 'bcryptjs';
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
        role: {},
      },
      async authorize(credentials): Promise<User | null> {
        try {
          const { email, password, role } = credentials;
          const user = await getUserFromDb(email as string);
          const myRoles = user?.roles;
          const isUserRoleEligible = myRoles?.some((r) => r.role === role);
          const passwordMatch = await bcrypt.compare(
            password as string,
            user?.password as string
          );

          if (isUserRoleEligible && passwordMatch) {
            return {
              name: `${user?.firstName} ${user?.lastName}`,
              id: user?.id,
              role: (role as string) ?? 'NORMAL_USER',
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
        password: true,
      },
      with: {
        roles: {
          columns: {
            role: true,
          },
        },
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
