'use client';
import ShowNav from './ShowNav';
import Link from 'next/link';
import Image from 'next/image';
import HeaderModal from './HeaderModal';
import NotificationsModal from './NotificationsModal';
import { Button } from './ui/button';
import { Bars3Icon } from '@heroicons/react/24/outline';

import { TNotifications } from '@/db/schema';
import { useState } from 'react';
import { FaTimes } from 'react-icons/fa';

export const HeaderElement = ({
  notifications = [],
  name,
  role,
}: {
  notifications: TNotifications[];
  role: 'NORMAL_USER' | 'CHIEF_EDITOR' | 'ADMIN';
  name: string;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <div className="flex items-center gap-8">
        <div className="lg:flex items-center gap-4">
          <Button
            onClick={() => setIsOpen(!isOpen)}
            variant={'ghost'}
            className="block md:hidden"
          >
            {isOpen ? <FaTimes /> : <Bars3Icon height={36} width={36} />}
          </Button>
          <Link href="/" className="hidden md:block">
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
