import { auth } from '@/auth';
import { db, notifications } from '@/db/schema';
import { HeaderElement } from './HeaderElement';
import { and, eq } from 'drizzle-orm';

export default async function Header() {
  const session = await auth();

  const role = session?.user?.role;
  const name = session?.user?.name?.split(' ')?.[1]?.substring(0, 1) as string;

  const notificationsData = await db
    .select()
    .from(notifications)
    .where(
      and(
        eq(notifications.userId, session?.user?.id || ''),
        eq(notifications.isRead, false)
      )
    );

  return (
    <header className="border-b bg-white sticky h-16 top-0 z-50">
      <div className="flex items-center justify-between h-full mx-3">
        <HeaderElement
          notifications={notificationsData}
          role={role as 'NORMAL_USER' | 'CHIEF_EDITOR' | 'ADMIN' | 'REVIEWER'}
          name={name}
        />
      </div>
    </header>
  );
}
