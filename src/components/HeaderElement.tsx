'use client';

import Link from 'next/link';
import Image from 'next/image';
import HeaderModal from './HeaderModal';
import NotificationsModal from './NotificationsModal';
import { TNotifications } from '@/db/schema';
import { useState } from 'react';
import { Badge } from './ui/badge';

export const HeaderElement = ({
  notifications = [],
  name,
  role,
}: {
  notifications?: TNotifications[];
  role?: string;
  name: string;
}) => {
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
          <div className="flex items-center space-x-4">
            <div>Journal of African Epidemiology and Public Health</div>
            <Badge className="bg-purple-100 text-purple-800">
              {role && role}
            </Badge>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <NotificationsModal notifications={notifications} />

        <HeaderModal name={name} />
      </div>
    </>
  );
};
