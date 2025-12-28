'use client';

import { useEffect, cloneElement, isValidElement } from 'react';
import { useSidebar } from '@/contexts/SidebarContext';

interface ProtectedLayoutClientProps {
  children: React.ReactNode;
  sidebar: React.ReactNode;
}

export default function ProtectedLayoutClient({
  children,
  sidebar,
}: ProtectedLayoutClientProps) {
  const { isSidebarOpen, setIsSidebarOpen } = useSidebar();

  const handleCloseSidebar = () => {
    setIsSidebarOpen(false);
  };

  // Close sidebar when window resizes to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [setIsSidebarOpen]);

  // Prevent body scroll when sidebar is open on mobile
  useEffect(() => {
    if (isSidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isSidebarOpen]);

  // Clone sidebar and pass onLinkClick handler
  const sidebarWithHandler = isValidElement(sidebar)
    ? cloneElement(sidebar, { onLinkClick: handleCloseSidebar } as any)
    : sidebar;

  return (
    <>
      {/* Sidebar */}
      <div
        className={`fixed top-16 left-0 h-[calc(100vh-4rem)] w-64 z-40 border-r bg-gray-50 transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {sidebarWithHandler}
      </div>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={handleCloseSidebar}
        />
      )}

      {/* Main content */}
      <div className="pt-16 lg:ml-64 min-h-screen">
        <div className="p-4 md:p-6 lg:p-8">{children}</div>
      </div>
    </>
  );
}
