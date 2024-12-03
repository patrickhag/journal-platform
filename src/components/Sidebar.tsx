'use client';

import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from './ui/button';
import { signOut } from 'next-auth/react';
import { Files, LayoutDashboard, LogOut } from 'lucide-react';

export const Sidebar = () => {
  const pathname = usePathname();
  return (
    <aside className="w-64 bg-white p-6 shadow-md flex flex-col justify-between max-h-[calc(100vh-4rem)] sticky top-16">
      <nav className="space-y-4">
        <Link
          href="/dashboard"
          className={cn(
            pathname.toLowerCase().split('/').includes('dashboard')
              ? 'bg-gray-100 hover:text-gray-800 text-gray-600 rounded-lg p-2'
              : 'text-gray-500 hover:text-gray-800',
            'flex items-center space-x-2'
          )}
        >
          <LayoutDashboard strokeWidth={1.75} />
          <span>Dashboard</span>
        </Link>
        <Link
          href="/articles"
          className={cn(
            pathname.toLowerCase().split('/').includes('articles')
              ? 'bg-gray-100 hover:text-gray-800 text-gray-600 rounded-lg p-2 '
              : 'text-gray-500 hover:text-gray-800',
            'flex items-center space-x-2'
          )}
        >
          <Files strokeWidth={1.75} />
          <span>Articles</span>
        </Link>
      </nav>
      <Button
        variant={'ghost'}
        className="justify-start"
        onClick={() => {
          signOut();
        }}
      >
        <LogOut strokeWidth={1.75} />
        Logout
      </Button>
    </aside>
  );
};
