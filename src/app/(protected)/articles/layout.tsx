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
        eq(notifications.personId, session?.user?.id),
        eq(notifications.isRead, false)
      )
    );

  return (
    <SessionProvider basePath={BASE_PATH} session={session}>
      <Header notifications={notificationsData} />
      <div className="bg-gray-100 min-h-screen">
        <div className="max-w-7xl mx-auto p-5">
          <div>{children}</div>
        </div>
      </div>
    </SessionProvider>
  );
}
