"use client";

import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

export const Sidebar = () => {
	const pathname = usePathname();
	return (
		<aside className="w-64 bg-white p-6 shadow-md">
			<nav className="space-y-4">
				<a
					href="#"
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
				</a>
				<a
					href="#"
					className="flex items-center space-x-2 text-gray-700 hover:text-gray-900"
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
				</a>
			</nav>
		</aside>
	);
};
