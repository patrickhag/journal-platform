import Image from 'next/image';
import { auth } from '@/auth';
import HeaderDropdown from './headerDropdown';

const Header = async () => {
  const session = await auth();
  const names = session?.user?.name?.split(' ')?.[1]?.substring(0, 1) as string;

  return (
    <>
      <div className="text-white text-center py-2 text-sm bg-gradient-to-r from-[#B8BCE4] to-[#737373]">
        Free space for journal publication
      </div>

      <header className="flex items-center justify-between px-8 py-4 backdrop-blur-sm shadow sticky top-0 z-50">
        <div className="text-xl font-bold flex items-center gap-2">
          <div className="rounded-full">
            <Image
              src="/jaep-logo.jpg"
              alt="Logo"
              width={32}
              height={32}
              className="rounded-full object-cover"
            />
          </div>
          Journal of African Epidemiology and Public Health
        </div>
        <nav className="flex gap-4 text-gray-700">
          <a href="#" className="hover:text-blue-500">
            Home
          </a>
          <a href="#" className="hover:text-blue-500">
            About
          </a>
          <a href="#" className="hover:text-blue-500">
            Articles
          </a>
          <a href="#" className="hover:text-blue-500">
            Authors
          </a>
          <a href="#" className="hover:text-blue-500">
            Reviewers
          </a>
        </nav>

        <HeaderDropdown names={names} session={session} />
      </header>
    </>
  );
};
export default Header;
