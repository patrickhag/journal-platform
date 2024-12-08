'use client';
import Link from 'next/link';
import { FileText, LayoutDashboard, Users } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

export default function ShowNav() {
  const pathname = usePathname();
  return (
    <nav className="max-w-6xl flex items-center gap-6">
      <Link
        href="/dashboard"
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
        href="/articles"
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
        href="/users"
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
    </nav>
  );
}
