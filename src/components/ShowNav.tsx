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
      <Link
        href="/editor/dashboard"
        className={cn(
          pathname.toLowerCase().split('/').includes('dashboard')
            ? 'text-gray-600 bg-gray-100 rounded-md px-2.5 py-1.5'
            : 'text-muted-foreground hover:text-gray-700'
        )}
      >
        <span className="flex items-center gap-2">
          <LayoutDashboard className="h-4 w-4" />
          Dashboard
        </span>
      </Link>

      <Link
        href="/editor/articles"
        className={cn(
          pathname.toLowerCase().split('/').includes('articles')
            ? 'text-gray-700 bg-gray-100 rounded-md px-2.5 py-1.5'
            : 'text-muted-foreground hover:text-gray-700'
        )}
      >
        <span className="flex items-center gap-2">
          <FileText className="h-4 w-4" />
          Articles
        </span>
      </Link>

      <Link
        href="/editor/users"
        className={cn(
          pathname.toLowerCase().split('/').includes('users')
            ? 'text-gray-700 bg-gray-100 rounded-md px-2.5 py-1.5'
            : 'text-muted-foreground hover:text-gray-700'
        )}
      >
        <span className="flex items-center gap-2">
          <Users className="h-4 w-4" />
          Users
        </span>
      </Link>
      <Link
        href="/editor/issues"
        className={cn(
          pathname.toLowerCase().split('/').includes('issues')
            ? 'text-gray-700 bg-gray-100 rounded-md px-2.5 py-1.5'
            : 'text-muted-foreground hover:text-gray-700'
        )}
      >
        <span className="flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          Issues
        </span>
      </Link>
      <Link
        href="/editor/proof"
        className={cn(
          pathname.toLowerCase().split('/').includes('proof')
            ? 'text-gray-700 bg-gray-100 rounded-md px-2.5 py-1.5'
            : 'text-muted-foreground hover:text-gray-700'
        )}
      >
        <span className="flex items-center gap-2">
          <FilePenLine className="h-4 w-4" />
          Proofs
        </span>
      </Link>
      <Link
        href="/editor/manage"
        className={cn(
          pathname.toLowerCase().split('/').includes('manage')
            ? 'text-gray-700 bg-gray-100 rounded-md px-2.5 py-1.5'
            : 'text-muted-foreground hover:text-gray-700'
        )}
      >
        <span className="flex items-center gap-2">
          <FileCog className="h-4 w-4" />
          Manage
        </span>
      </Link>
      <Link
        href="/editor/manage/editorial-board-members"
        className={cn(
          pathname.toLowerCase().includes('editorial-board-members')
            ? 'text-gray-700 bg-gray-100 rounded-md px-2.5 py-1.5'
            : 'text-muted-foreground hover:text-gray-700'
        )}
      >
        <span className="flex items-center gap-2">
          <Users className="h-4 w-4" />
          Editorial Board
        </span>
      </Link>
    </nav>
  );
}
