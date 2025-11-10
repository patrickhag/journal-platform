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
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { signOut } from 'next-auth/react';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export default function HeaderDropdown({
  names,
  session,
}: {
  names?: string;
  session: Session | null;
}) {
  const handleDashboardRedirect = () => {
    const role = session?.user?.role;

    switch (role) {
      case 'NORMAL_USER':
        redirect('/author/submissions');
        break;
      case 'ASSOCIATE_EDITOR':
        redirect('/staff-editor/assigned');
        break;
      case 'CHIEF_EDITOR':
        redirect('/editor/dashboard');
        break;
      case 'REVIEWER':
        redirect('/reviewer/assignments');
        break;
      default:
        redirect('/');
    }
  };

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
              <AvatarFallback className="lowercase">{names}</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleDashboardRedirect}>
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
