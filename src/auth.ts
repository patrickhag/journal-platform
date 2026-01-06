import { db } from '@/db/db';
import { users } from '@/db/schema';
import logger from '@/lib/logger';
import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';
import NextAuth, { type User, type NextAuthConfig, AuthError } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';

// Custom error class that extends AuthError with a code property
class CustomCredentialsError extends AuthError {
  code: string;
  constructor(message: string, code: string) {
    super(message);
    this.code = code;
    this.name = 'CredentialsSignin';
    this.type = 'CredentialsSignin';
  }
}

// Custom error classes with specific error codes
class EmailNotVerifiedError extends CustomCredentialsError {
  constructor() {
    super('EMAIL_NOT_VERIFIED', 'EMAIL_NOT_VERIFIED');
  }
}

class UserNotFoundError extends CustomCredentialsError {
  constructor() {
    super('USER_NOT_FOUND', 'USER_NOT_FOUND');
  }
}

class InvalidPasswordError extends CustomCredentialsError {
  constructor() {
    super('INVALID_PASSWORD', 'INVALID_PASSWORD');
  }
}

class InvalidRoleError extends CustomCredentialsError {
  constructor() {
    super('INVALID_ROLE', 'INVALID_ROLE');
  }
}

class PasswordNotSetError extends CustomCredentialsError {
  constructor() {
    super('PASSWORD_NOT_SET', 'PASSWORD_NOT_SET');
  }
}

class MissingCredentialsError extends CustomCredentialsError {
  constructor() {
    super('MISSING_CREDENTIALS', 'MISSING_CREDENTIALS');
  }
}

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

          // Validate input
          if (!email || !password || !role) {
            throw new MissingCredentialsError();
          }

          const user = await getUserFromDb(email as string);

          // Case 1: User doesn't exist
          if (!user) {
            throw new UserNotFoundError();
          }

          // Case 2: Missing password in database
          if (!user.password) {
            throw new PasswordNotSetError();
          }

          const myRoles = user.roles;
          const isUserRoleEligible = myRoles?.some((r) => r.role === role);
          const passwordMatch = await bcrypt.compare(
            password as string,
            user.password as string
          );

          // Case 3: Wrong password
          if (!passwordMatch) {
            throw new InvalidPasswordError();
          }

          // Case 4: User doesn't have the selected role
          if (!isUserRoleEligible) {
            throw new InvalidRoleError();
          }

          // Case 5: User account is not active
          if (!user.isActive) {
            throw new EmailNotVerifiedError();
          }

          // Success - all checks passed
          return {
            name: `${user.firstName} ${user.lastName}`,
            id: user.id,
            role: (role as string) ?? 'NORMAL_USER',
          };
        } catch (error) {
          // Re-throw our custom credential errors
          if (
            error instanceof CustomCredentialsError ||
            error instanceof AuthError
          ) {
            throw error;
          }
          // Log and re-throw other errors
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
        isActive: true,
        emailVerified: true,
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
