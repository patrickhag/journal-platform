import { auth } from '@/auth';
import { db, TNotifications } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { users } from '@/db/schema';
import { USER_ROLE } from '@/lib/roles';
import { HeaderElement } from './HeaderElement';
export default async function Header({
  notifications = [],
}: {
  notifications: TNotifications[];
}) {
  const session = await auth();

  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.email, session?.user?.email as string));

  const role = user?.role as USER_ROLE;
  const name = session?.user?.name?.split(' ')?.[1]?.substring(0, 1) as string;

  return (
    <header className="border-b bg-white sticky h-16 top-0 z-50">
      <div className="flex items-center justify-between h-full mx-3">
        <HeaderElement notifications={notifications} role={role} name={name} />
      </div>
    </header>
  );
}
