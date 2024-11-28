import React from "react";
import Image from "next/image";
import Link from "next/link";
const Header = () => {
  return (
    <>
      <div className="text-white text-center py-2 text-sm bg-gradient-to-r from-[#B8BCE4] to-[#737373]">
        Free space for journal publication
      </div>

      <header className="flex items-center justify-between px-8 py-4 bg-gray-50 shadow">
        <div className="text-xl font-bold flex items-center gap-2">
          <div className="rounded-full">
            <Image
              src="/logo.png"
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
        <div className="flex items-center gap-4">
          <button
            className="text-white px-3 py-1 rounded hover:bg-blue-700"
            style={{ background: "#1A237E" }}
          >
            Submit a manuscript
          </button>
          <Link href={'/dashboard'}>
            <img
              src="https://res.cloudinary.com/dwhfpxrgz/image/upload/v1732714677/avatar_ddv8a8.png"
              alt="Profile"
              className="w-8 h-8 rounded-full"
            />
          </Link>
        </div>
      </header>
    </>
  );
};
export default Header;
