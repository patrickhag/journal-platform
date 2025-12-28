'use client';

import { Menu, X } from 'lucide-react';
import { useSidebar } from '@/contexts/SidebarContext';

export default function HeaderToggleButton() {
  const { isSidebarOpen, toggleSidebar } = useSidebar();

  return (
    <button
      onClick={toggleSidebar}
      className="lg:hidden p-2 hover:bg-gray-100 rounded-md transition-colors"
      aria-label="Toggle sidebar"
    >
      {isSidebarOpen ? (
        <X className="h-6 w-6 text-gray-700" />
      ) : (
        <Menu className="h-6 w-6 text-gray-700" />
      )}
    </button>
  );
}
