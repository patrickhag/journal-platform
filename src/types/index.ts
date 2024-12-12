import { User } from 'next-auth';

export type CustomUser = User & {
  role: string;
};
