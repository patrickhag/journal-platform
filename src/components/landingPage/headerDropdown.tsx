'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { UserRound } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { handleDashboardRedirect } from '@/lib/utils';

export default function HeaderDropdown() {
  const { data: session } = useSession();
  const names = session?.user?.name?.split(' ')?.[1]?.substring(0, 1);
  const role = session?.user.role;

  return (
    <div className="flex items-center gap-4">
      <Link href="/author/new-manuscript">
        <Button className="text-white px-3 py-2 rounded bg-[#212c9e] hover:bg-[#1A237E]">
          Submit your research
        </Button>
      </Link>
      {session?.user && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar className="cursor-pointer">
              <AvatarFallback className="lowercase">
                {names as string}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => handleDashboardRedirect(role as string)}
            >
              My Dashboard
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => redirect('/profile')}>
              Edit Profile
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => signOut({ redirect: true, callbackUrl: '/' })}
            >
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
      {!session?.user && (
        <UserRound
          size={20}
          onClick={() => redirect('/login')}
          className="cursor-pointer"
        />
      )}
    </div>
  );
}
