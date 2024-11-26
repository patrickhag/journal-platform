"use client";
import { usePathname } from "next/navigation";
import React from "react";
const journalKeys = ["start", "attach-files", "meta", "reviewer", "final"];
export const ProgressLine = () => {
	const pathname = usePathname();
	const page = pathname.split("/").at(-1);
	console.log(page);
	return (
		<div className="mb-8">
			<div className="flex items-center space-x-4">
				{journalKeys.map((j, i) => (
					<React.Fragment key={j}>
						<div
							className={`flex h-8 w-8 items-center justify-center rounded-full ${i < journalKeys.indexOf(page ?? "start") ? "bg-blue-600" : "bg-blue-200"} text-white`}
						>
							{i < journalKeys.indexOf(page ?? "") ? "✓" : i + 1}
						</div>
						<div className="text-blue-600">{j}</div>
						{i < journalKeys.length - 1 && (
							<div className="h-px w-16 bg-gray-300" />
						)}
					</React.Fragment>
				))}
			</div>
		</div>
	);
};
