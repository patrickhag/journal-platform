'use client';

import Image from 'next/image';
import { usePathname } from 'next/navigation';
import HeaderDropdown from './headerDropdown';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useState } from 'react';

const navItems = [
  { path: '/', label: 'Home' },
  { path: '/about', label: 'About' },
  { path: '/articles', label: 'Articles' },
  { path: '/authors', label: 'Authors' },
  { path: '#', label: 'Reviewers' },
];

export default function Header() {
  const { data: session } = useSession();
  const names = session?.user?.name?.split(' ')?.[1]?.substring(0, 1);
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      <div className="text-white text-center py-2 text-sm bg-gradient-to-r from-[#B8BCE4] to-[#737373]">
        Free space for journal publication
      </div>

      <header className="flex flex-wrap items-center justify-between px-4 md:px-8 py-4 backdrop-blur-md shadow sticky top-0 z-50">
        <div className="text-xl font-bold">
          <Link href="/" className="rounded-full flex items-center gap-2">
            <Image
              src="/jaep-logo.jpg"
              alt="JAEPH Logo"
              width={32}
              height={32}
              className="rounded-full object-cover"
            />
            <span className="hidden sm:inline text-lg max-[1132px]:text-sm">
              Journal of African Epidemiology and Public Health
            </span>
            <span className="sm:hidden">JAEPH</span>
          </Link>
        </div>

        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="lg:hidden p-2 hover:bg-gray-100 rounded focus:outline-none"
        >
          {isMobileMenuOpen ? (
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          )}
        </button>

        <nav className="hidden lg:flex items-center gap-6 text-gray-700 max-[1132px]:text-sm">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.path}
              className={`${
                pathname === item.path ? 'text-blue-500' : 'hover:text-blue-500'
              }`}
            >
              {item.label}
            </Link>
          ))}
          <HeaderDropdown names={names} session={session} />
        </nav>

        {/* Mobile Dropdown Menu */}
        <div
          className={`lg:hidden w-full absolute left-0 top-full  ${
            isMobileMenuOpen ? 'block' : 'hidden'
          }`}
        >
          <nav className="flex flex-col gap-4 p-6 border-t bg-white backdrop-blur-md shadow z-50">
            {navItems.map((item) => (
              <Link
                key={item.label}
                onClick={() => setIsMobileMenuOpen(false)}
                href={item.path}
                className={`${
                  pathname === item.path
                    ? 'text-blue-500'
                    : 'hover:text-blue-500'
                }`}
              >
                {item.label}
              </Link>
            ))}
            <div className="mt-4 pt-4 border-t">
              <HeaderDropdown names={names} session={session} />
            </div>
          </nav>
        </div>
      </header>
    </>
  );
}
