'use client';

import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { handleDashboardRedirect } from '@/lib/utils';
import { useGetUserInfo } from '@/hooks/useUsers';

export default function HeaderModal({
  name,
  role,
  userId,
}: {
  name: string;
  role: string;
  userId: string;
}) {
  const router = useRouter();
  const { data: userInfo } = useGetUserInfo(userId);
  const avatarUrl = userInfo?.user?.avatar || '';
  const firstInitial = userInfo?.user?.firstName?.[0] || '';
  const lastInitial = userInfo?.user?.lastName?.[0] || '';
  const fallback = `${firstInitial}${lastInitial}`.trim() || name || '?';

  return (
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
        <DropdownMenuItem onClick={() => handleDashboardRedirect(role)}>
          My Dashboard
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => router.replace('/profile')}>
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
  );
}
