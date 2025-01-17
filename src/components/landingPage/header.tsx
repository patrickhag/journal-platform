'use client';

import Image from 'next/image';
import { usePathname } from 'next/navigation';
import HeaderDropdown from './headerDropdown';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

export default function Header() {
  const { data: session } = useSession();
  const names = session?.user?.name?.split(' ')?.[1]?.substring(0, 1);

  const pathname = usePathname();

  return (
    <>
      <div className="text-white text-center py-2 text-sm bg-gradient-to-r from-[#B8BCE4] to-[#737373]">
        Free space for journal publication
      </div>

      <header className="flex items-center justify-between px-8 py-4 backdrop-blur-md shadow sticky top-0 z-50">
        <div className="text-xl font-bold flex items-center gap-2">
          <div className="rounded-full">
            <Link href="/">
              <Image
                src="/jaep-logo.jpg"
                alt="JAEPH Logo"
                width={32}
                height={32}
                className="rounded-full object-cover"
              />
            </Link>
          </div>
          Journal of African Epidemiology and Public Health
        </div>
        <nav className="flex gap-4 text-gray-700">
          <Link
            href="/"
            className={`${
              pathname === '/' ? 'text-blue-500' : 'hover:text-blue-500'
            }`}
          >
            Home
          </Link>
          <Link
            href="/about"
            className={`${
              pathname === '/about' ? 'text-blue-500' : 'hover:text-blue-500'
            }`}
          >
            About
          </Link>
          <Link
            href="/articles"
            className={`${
              pathname === '/articles' ? 'text-blue-500' : 'hover:text-blue-500'
            }`}
          >
            Articles
          </Link>
          <Link
            href="/authors"
            className={`${
              pathname === '/authors' ? 'text-blue-500' : 'hover:text-blue-500'
            }`}
          >
            Authors
          </Link>
          <Link href="#" className="hover:text-blue-500">
            Reviewers
          </Link>
        </nav>
        <HeaderDropdown names={names} session={session} />
      </header>
    </>
  );
}
