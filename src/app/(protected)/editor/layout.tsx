import { auth } from '@/auth';
import Header from '@/components/Header';
import { db, notifications } from '@/db/schema';
import { and, eq } from 'drizzle-orm';

export default async function EditorLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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
    <div className="bg-gray-100 min-h-screen">
      <Header notifications={notificationsData} />
      <main>{children}</main>
    </div>
  );
}
