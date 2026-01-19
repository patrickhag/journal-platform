'use client';

import Image from 'next/image';
import { usePathname } from 'next/navigation';
import HeaderDropdown from './headerDropdown';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { useGetManuals } from '@/hooks/useSettings';

const navItems = [
  { path: '/', label: 'Home' },
  { path: '/manuals/#aboutUs', label: 'About' },
  { path: '/articles/issues', label: 'Articles' },
  { path: '/manuals/#guidelines', label: 'Authors' },
  { path: '/contact-us', label: 'Contact Us' },
  { path: '/search-articles', label: 'Search' },
];

export default function Header() {
  const pathname = usePathname();
  const { data: manualData } = useGetManuals();

  const { marqueeText, issn } =
    (manualData?.generalSettings as {
      marqueeText?: string;
      issn?: string;
    } | null) || {};

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isMobileMenuOpen &&
        menuRef.current &&
        buttonRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsMobileMenuOpen(false);
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMobileMenuOpen]);

  const isActiveLink = (itemPath: string, currentPath: string) => {
    if (itemPath === '/') {
      return currentPath === '/';
    }

    if (
      itemPath === '/articles' &&
      currentPath.includes('/articles/article/')
    ) {
      return true;
    }

    return currentPath.startsWith(itemPath) && itemPath !== '/';
  };

  return (
    <div className="sticky top-0 z-50">
      <div className="relative overflow-hidden border-b border-slate-200/60 bg-[#1a2440]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(14,165,233,0.35),transparent_55%)]" />
        <div className="relative flex items-center gap-3 px-4 py-2 md:px-8">
          <span className="shrink-0 rounded-full bg-white/12 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-sky-200">
            Latest
          </span>
          <div className="flex-1 overflow-hidden">
            <div className="text-sky-100 text-sm font-medium animate-marquee whitespace-nowrap inline-block">
              {marqueeText || 'Free space for journal publication'}
            </div>
          </div>
        </div>
      </div>

      <header className="flex flex-wrap items-center justify-between px-4 md:px-8 py-4 backdrop-blur-md shadow">
        <div className="text-xl font-bold">
          <Link href="/" className="rounded-full flex items-center gap-2">
            <Image
              src="/jaep-logo.png"
              alt="JAEPH Logo"
              width={40}
              height={40}
              className="rounded-full object-cover"
            />
            <span className="hidden sm:inline text-lg max-[1132px]:text-sm">
              JAEP Health Sciences
            </span>
            <span className="sm:hidden">JAEP Health Sciences</span>
            {issn ? (
              <span className="hidden md:inline text-xs text-gray-500">
                ISSN {issn}
              </span>
            ) : null}
          </Link>
        </div>

        <button
          ref={buttonRef}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="lg:hidden relative w-10 h-10 flex flex-col items-center justify-center gap-1.5 rounded-lg hover:bg-gray-100 active:bg-gray-200 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          aria-label="Toggle menu"
        >
          <span
            className={`block w-6 h-0.5 bg-gray-700 rounded-full transition-all duration-300 ease-in-out ${
              isMobileMenuOpen
                ? 'rotate-45 translate-y-2 bg-blue-600'
                : 'rotate-0 translate-y-0'
            }`}
          />
          <span
            className={`block w-6 h-0.5 bg-gray-700 rounded-full transition-all duration-300 ease-in-out ${
              isMobileMenuOpen ? 'opacity-0' : 'opacity-100'
            }`}
          />
          <span
            className={`block w-6 h-0.5 bg-gray-700 rounded-full transition-all duration-300 ease-in-out ${
              isMobileMenuOpen
                ? '-rotate-45 -translate-y-2 bg-blue-600'
                : 'rotate-0 translate-y-0'
            }`}
          />
        </button>

        <nav className="hidden lg:flex items-center gap-6 text-gray-700 max-[1132px]:text-sm">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.path}
              className={cn(
                isActiveLink(item.path, pathname)
                  ? 'text-blue-500'
                  : 'hover:text-blue-500'
              )}
            >
              {item.label}
            </Link>
          ))}
          <HeaderDropdown />
        </nav>

        {/* Mobile Dropdown Menu */}
        <div
          ref={menuRef}
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
              <HeaderDropdown />
            </div>
          </nav>
        </div>
      </header>
    </div>
  );
}
