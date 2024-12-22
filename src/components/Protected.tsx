import { auth } from '@/auth';
import { db, users } from '@/db/schema';
import { USER_ROLE } from '@/lib/roles';
import { eq } from 'drizzle-orm';
import { ReactNode } from 'react';

interface ProtectedProps {
  allowedRoles: string[];
  children: ReactNode;
}

export default async function Protected({
  allowedRoles,
  children,
}: ProtectedProps) {
  const session = await auth();

  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.personId, session?.user?.id as string));

  const role = user?.role as USER_ROLE;

  if (!allowedRoles.includes(role)) {
    return (
      <div className="grid place-items-center h-[calc(100vh-4rem)]">
        <div className="flex">
          <h1 className="text-2xl font-bold">401</h1>
          <div className="border-r-2 mx-4"></div>
          <p className="mt-1">You are not authorized to view this page.</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
