'use client';

import { useSession } from 'next-auth/react';
import { HeaderElement } from './HeaderElement';
import { useGetNotifications } from '@/hooks/useSettings';

export default function Header() {
  const { data } = useSession();
  const roleMap: Record<string, string> = {
    NORMAL_USER: 'Author',
    CHIEF_EDITOR: 'Chief Editor',
    ASSOCIATE_EDITOR: 'Associate Editor',
    ADMIN: 'Admin',
    REVIEWER: 'Reviewer',
  };
  const roleKey = data?.user?.role;
  const role = roleMap[roleKey as string] || roleKey;

  const name = data?.user?.name?.split(' ')?.[1]?.substring(0, 1) as string;

  const { data: notificationsData } = useGetNotifications();

  return (
    <header className="border-b bg-white sticky h-16 top-0 z-50">
      <div className="flex items-center justify-between h-full mx-3">
        <HeaderElement
          notifications={notificationsData}
          role={role as string}
          name={name}
        />
      </div>
    </header>
  );
}
