import Link from 'next/link';
import Image from 'next/image';
import HeaderModal from './HeaderModal';
import NotificationsModal from './NotificationsModal';
import { Badge } from './ui/badge';
import { roleMap } from '@/lib/utils';
import { auth } from '@/auth';

export const HeaderElement = async () => {
  const session = await auth();
  const roleKey = session?.user.role;
  const role = roleMap[roleKey as string];

  const name = session?.user.name?.split(' ')?.[1]?.substring(0, 1) as string;

  return (
    <>
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-4">
          <Link href="/" className="block">
            <Image
              src="/jaep-logo.png"
              alt="Logo"
              width={32}
              height={32}
              className="rounded-full object-cover"
            />
          </Link>
          <div className="flex items-center space-x-4">
            <div>Journal of African Epidemiology and Public Health</div>
            <Badge className="bg-purple-100 text-purple-800 hover:text-purple-800 hover:bg-purple-100">
              {role && role}
            </Badge>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <NotificationsModal />

        <HeaderModal name={name} />
      </div>
    </>
  );
};
