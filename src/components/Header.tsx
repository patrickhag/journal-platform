import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { Bell } from 'lucide-react';
import { auth } from '@/auth';
import { db, TNotifications } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { users } from '@/db/schema';
import { USER_ROLE } from '@/lib/roles';
import ShowNav from './ShowNav';
import HeaderModal from './HeaderModal';
import NotificationsModal from './NotificationsModal';

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
        <div className="flex items-center gap-8">
          {/* {(role === 'ADMIN' || role === 'CHIEF_EDITOR') && <ShowNav />} */}
          <div className="flex items-center gap-4">
            <Link href="/">
              <Image
                src="/jaep-logo.jpg"
                alt="Logo"
                width={32}
                height={32}
                className="rounded-full object-cover"
              />
            </Link>
            {role !== 'ADMIN' && role !== 'CHIEF_EDITOR' && (
              <h1 className="text-xl font-bold">
                Journal of African Epidemiology and Public Health
              </h1>
            )}
          </div>
          {(role === 'ADMIN' || role === 'CHIEF_EDITOR') && <ShowNav />}
        </div>
        <div className="flex items-center gap-4">
          <NotificationsModal notifications={notifications} />

          <HeaderModal name={name} />
        </div>
      </div>
    </header>
  );
}
