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
import { Session } from 'next-auth';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { signOut } from 'next-auth/react';

export default function HeaderDropdown({
  names,
  session,
}: {
  names?: string;
  session: Session | null;
}) {
  const router = useRouter();
  return (
    <div className="flex items-center gap-4">
      <Button
        className="text-white px-3 py-2 rounded bg-[#212c9e] hover:bg-[#1A237E]"
        onClick={() =>
          session?.user
            ? router.replace('/articles/new/start')
            : router.replace('/login')
        }
      >
        Submit a manuscript
      </Button>
      {session?.user && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar className="cursor-pointer">
              <AvatarFallback>{names}</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => router.replace('/submissions')}>
              Dashboard
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.replace('/profile')}>
              Edit Profile
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                signOut();
                router.replace('/');
              }}
            >
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
      {!session?.user && (
        <UserRound
          size={20}
          onClick={() => router.replace('/login')}
          className="cursor-pointer"
        />
      )}
    </div>
  );
}
