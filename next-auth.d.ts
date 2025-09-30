import { USER_ROLE } from '@/lib/roles';
import { DefaultSession, DefaultUser } from 'next-auth';
import { JWT, DefaultJWT } from 'next-auth/jwt';

declare module 'next-auth' {
  interface Session extends DefaultSession {
    user: {
      id: string;
      name: string;
      role: string;
    } & DefaultSession;
  }

  interface User extends DefaultUser {
    role: string;
    error?: string | null;
  }
}

declare module 'next-auth/jwt' {
  interface JWT extends DefaultJWT {
    id: string;
    role: string;
    error?: string | null;
  }
}
