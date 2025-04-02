'use client';

import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { doLogout } from '@/actions/logout';

export default function HeaderModal({ name }: { name: string }) {
  const router = useRouter();
  const session = useSession();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="cursor-pointer">
          <AvatarFallback className="lowercase">{name}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>
          My Account({session.data?.user.role})
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => router.replace('/submissions')}>
          My Dashboard
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => router.replace('/profile')}>
          Edit Profile
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={async () => {
            await doLogout();
          }}
        >
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// const Logout = () => {
//   return (
//     <form action={doLogout}>
//       <button className="bg-blue-400 my-2 text-white p-1 rounded" type="submit">
//         Logout
//       </button>
//     </form>
//   );
// };
