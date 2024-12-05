'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { redirect } from 'next/navigation';
import { signOut } from 'next-auth/react';

export default function HeaderDropdown({ names }: { names: string }) {
  const redirectMe = '/';
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <div className="px-1.5 py-1 text-sm">{names}</div>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem
          onClick={() => {
            signOut();
            redirect(redirectMe);
          }}
        >
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
