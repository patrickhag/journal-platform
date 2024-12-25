import { auth } from '@/auth';
import { db, users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { redirect, RedirectType } from 'next/navigation';

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user?.id) return;
  const user = await db
    .select()
    .from(users)
    .where(eq(users.id, session.user.id));
  if (!user.at(0)?.isActive) {
    return redirect('/', RedirectType.replace);
  }
  return <>{children}</>;
}
