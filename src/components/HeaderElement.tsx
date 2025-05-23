'use client';

import ShowNav from './ShowNav';
import Link from 'next/link';
import Image from 'next/image';
import HeaderModal from './HeaderModal';
import NotificationsModal from './NotificationsModal';
import { TNotifications } from '@/db/schema';
import { useState } from 'react';

export const HeaderElement = ({
  notifications = [],
  name,
  role,
}: {
  notifications?: TNotifications[];
  role?: 'NORMAL_USER' | 'CHIEF_EDITOR' | 'ADMIN' | 'REVIEWER';
  name: string;
}) => {
  const [isOpen] = useState(false);
  return (
    <>
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-4">
          <Link href="/" className="block">
            <Image
              src="/jaep-logo.png"
              alt="Logo"
              width={32}
              height={32}
              className="rounded-full object-cover"
            />
          </Link>
          {role !== 'ADMIN' && role !== 'CHIEF_EDITOR' && (
            <h1>
              <span className="hidden sm:inline text-lg max-[1132px]:text-sm">
                Journal of African Epidemiology and Public Health
              </span>
              <span className="sm:hidden">JAEPH</span>
            </h1>
          )}
        </div>
        {(role === 'ADMIN' || role === 'CHIEF_EDITOR') && (
          <ShowNav isOpen={isOpen} />
        )}
      </div>
      <div className="flex items-center gap-4">
        <NotificationsModal notifications={notifications} />

        <HeaderModal name={name} />
      </div>
    </>
  );
};
