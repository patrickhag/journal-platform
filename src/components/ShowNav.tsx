'use client';

import Link from 'next/link';
import {
  Calendar,
  FileCog,
  FilePenLine,
  Files,
  FileText,
  LayoutDashboard,
  Users,
} from 'lucide-react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const navItems = [
  { label: 'Dashboard', href: '/editor/dashboard', icon: LayoutDashboard },
  { label: 'Articles', href: '/editor/articles', icon: FileText },
  { label: 'Users', href: '/editor/users', icon: Users },
  { label: 'Collections', href: '/editor/collections', icon: Files },
  { label: 'Issues', href: '/editor/issues', icon: Calendar },
  { label: 'Proofs', href: '/editor/proof', icon: FilePenLine },
  { label: 'Manage', href: '/editor/manage', icon: FileCog },
];

export default function ShowNav({ isOpen = false }: { isOpen: boolean }) {
  const pathname = usePathname().toLowerCase();

  return (
    <nav
      className={cn(
        'max-w-6xl bg-white absolute md:top-0 top-[60px] md:p-0 p-8 grid left-0 md:relative md:flex items-center gap-6',
        !isOpen && 'hidden'
      )}
    >
      {navItems.map(({ label, href, icon: Icon }) => {
        const isActive = pathname.includes(href.split('/').pop() || '');
        const baseClasses = 'text-muted-foreground hover:text-gray-700';
        const activeClasses =
          'text-gray-700 bg-gray-100 rounded-md px-2.5 py-1.5';

        return (
          <Link
            key={href}
            href={href}
            className={cn(isActive ? activeClasses : baseClasses)}
          >
            <span className="flex items-center gap-2">
              <Icon className="h-4 w-4" />
              {label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
