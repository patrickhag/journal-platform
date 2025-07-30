'use client';

import { useState } from 'react';
import Link from 'next/link';
import HeaderDropdown from './headerDropdown';
import { cn } from '@/lib/utils';

export default function HeaderMobileMenu({
  navItems,
  pathname,
  names,
  session,
}: any) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Toggle button */}
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

      {/* Mobile dropdown */}
      <div
        className={`lg:hidden w-full absolute left-0 top-full ${
          isMobileMenuOpen ? 'block' : 'hidden'
        }`}
      >
        <nav className="flex flex-col gap-4 p-6 border-t bg-white backdrop-blur-md shadow z-50">
          {navItems.map((item: any) => (
            <Link
              key={item.label}
              onClick={() => setIsMobileMenuOpen(false)}
              href={item.path}
              className={cn(
                (pathname.startsWith(item.path) && item.path !== '/') ||
                  (pathname === item.path && item.path === '/')
                  ? 'text-blue-500'
                  : 'hover:text-blue-500'
              )}
            >
              {item.label}
            </Link>
          ))}
          <div className="mt-4 pt-4 border-t">
            <HeaderDropdown names={names} session={session} />
          </div>
        </nav>
      </div>
    </>
  );
}
