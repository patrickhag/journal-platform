"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "./ui/button";
import { signOut } from "next-auth/react";

export const Sidebar = () => {
  const pathname = usePathname();
  return (
    <aside className="w-64 bg-white p-6 shadow-md flex flex-col justify-between max-h-[calc(100vh-4rem)] sticky top-16">
      <nav className="space-y-4">
        <Link
          href="/dashboard"
          className={cn(
            pathname.toLowerCase().split("/").includes("dashboard")
              ? "text-[#838F9A]"
              : "text-gray-700 ",
            "flex items-center space-x-2 hover:text-gray-900",
          )}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 10h16M4 14h16M4 18h16"
            />
          </svg>
          <span>Dashboard</span>
        </Link>
        <Link
          href="/articles" className={cn(
            pathname.toLowerCase().split("/").includes("articles")
              ? "text-[#838F9A]"
              : "text-gray-700 ",
            "flex items-center space-x-2 hover:text-gray-900",
          )}

        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
            />
          </svg>
          <span>Articles</span>
        </Link>
      </nav>
      <Button variant={'ghost'} className="justify-start" onClick={() => {
        signOut()
      }}><svg width="30" height="29" viewBox="0 0 30 29" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M5.29325 3.52884C5.76121 3.52884 6.20999 3.34294 6.54089 3.01205C6.87178 2.68116 7.05767 2.23237 7.05767 1.76442C7.05767 1.29647 6.87178 0.847679 6.54089 0.516786C6.20999 0.185894 5.76121 0 5.29325 0H1.76442C1.29647 0 0.847679 0.185894 0.516786 0.516786C0.185894 0.847679 0 1.29647 0 1.76442V26.4663C0 26.9342 0.185894 27.383 0.516786 27.7139C0.847679 28.0448 1.29647 28.2307 1.76442 28.2307H5.29325C5.76121 28.2307 6.20999 28.0448 6.54089 27.7139C6.87178 27.383 7.05767 26.9342 7.05767 26.4663C7.05767 25.9983 6.87178 25.5495 6.54089 25.2186C6.20999 24.8877 5.76121 24.7019 5.29325 24.7019H3.52884V3.52884H5.29325ZM29.6775 13.092L24.7019 6.03431C24.432 5.65392 24.0225 5.39584 23.563 5.31649C23.1034 5.23714 22.6311 5.34297 22.2493 5.61085C22.0585 5.74457 21.896 5.91476 21.7713 6.1116C21.6466 6.30844 21.5622 6.52803 21.5228 6.75769C21.4834 6.98736 21.4899 7.22254 21.542 7.44968C21.594 7.67681 21.6905 7.89139 21.8259 8.08103L24.8606 12.3509H10.5865C10.1186 12.3509 9.66977 12.5368 9.33888 12.8677C9.00798 13.1986 8.82209 13.6474 8.82209 14.1153C8.82209 14.5833 9.00798 15.0321 9.33888 15.363C9.66977 15.6939 10.1186 15.8798 10.5865 15.8798H24.7019L21.5259 20.1144C21.3869 20.2997 21.2857 20.5107 21.2282 20.7351C21.1707 20.9596 21.158 21.1932 21.1907 21.4225C21.2235 21.6519 21.3011 21.8726 21.4192 22.072C21.5373 22.2714 21.6934 22.4455 21.8788 22.5845C22.1842 22.8136 22.5557 22.9374 22.9374 22.9374C23.2114 22.9374 23.4815 22.8737 23.7265 22.7512C23.9715 22.6287 24.1846 22.4508 24.349 22.2317L29.6422 15.174C29.8682 14.8756 29.9934 14.513 29.9997 14.1387C30.0061 13.7645 29.8932 13.3979 29.6775 13.092Z" fill="#141A26" />
        </svg>
        Logout</Button>
    </aside>
  );
};
