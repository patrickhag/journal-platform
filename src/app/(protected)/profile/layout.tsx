import { BASE_PATH, auth } from '@/auth';
import Header from '@/components/Header';
import { db, notifications } from '@/db/schema';
import { and, eq } from 'drizzle-orm';
import { SessionProvider } from 'next-auth/react';
import type { PropsWithChildren } from 'react';

export default async function Layout({ children }: PropsWithChildren) {
  const session = await auth();
  if (!session?.user?.id) return undefined;

  const notificationsData = await db
    .select()
    .from(notifications)
    .where(
      and(
        eq(notifications.userId, session?.user?.id),
        eq(notifications.isRead, false)
      )
    );

  return (
    <SessionProvider basePath={BASE_PATH} session={session}>
      <Header notifications={notificationsData} />
      <div className="flex bg-gray-100 min-h-screen">
        <div className="flex-1 p-8">
          <div className="container">{children}</div>
        </div>
      </div>
    </SessionProvider>
  );
}
