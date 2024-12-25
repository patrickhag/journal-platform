import { USER_ROLE } from '@/lib/roles';
import { DefaultSession, DefaultUser } from 'next-auth';
import { JWT, DefaultJWT } from 'next-auth/jwt';

declare module 'next-auth' {
  interface Session extends DefaultSession {
    user: {
      id: string;
      name: string;
      role: USER_ROLE;
    } & DefaultSession;
  }

  interface User extends DefaultUser {
    role: USER_ROLE;
  }
}

declare module 'next-auth/jwt' {
  interface JWT extends DefaultJWT {
    id: string;
    role: USER_ROLE;
  }
}
