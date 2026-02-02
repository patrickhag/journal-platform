'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { LogInIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { signOut, useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { handleDashboardRedirect } from '@/lib/utils';
import Link from 'next/link';
import { useGetUserInfo } from '@/hooks/useUsers';

export default function HeaderDropdown() {
  const { data: session } = useSession();
  const role = session?.user.role;
  const userId = session?.user?.id || '';
  const { data: userInfo } = useGetUserInfo(userId);
  const avatarUrl = userInfo?.user?.avatar || '';
  const firstInitial = userInfo?.user?.firstName?.[0] || '';
  const lastInitial = userInfo?.user?.lastName?.[0] || '';
  const sessionInitial =
    session?.user?.name?.split(' ')?.[0]?.substring(0, 1) || '';
  const fallback =
    `${firstInitial}${lastInitial}`.trim() || sessionInitial || '?';

  return (
    <div className="flex items-center gap-4">
      <Link href={'/author/new-manuscript'}>
        <Badge className="text-white px-3 py-2 rounded bg-[#212c9e] hover:bg-[#212c9e] cursor-pointer">
          Submit a research
        </Badge>
      </Link>
      {session?.user && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar className="cursor-pointer">
              <AvatarImage src={avatarUrl} alt="User profile" />
              <AvatarFallback className="lowercase">{fallback}</AvatarFallback>
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
        <Button variant={'outline'} onClick={() => redirect('/login')}>
          Login
          <LogInIcon size={20} className="cursor-pointer" />
        </Button>
      )}
    </div>
  );
}
