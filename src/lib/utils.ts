import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { HTMLAttributes } from "react";
import { TArticle } from "@/schemas/reviewer";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export const generateRandomBgColorForStatus = (status: TArticle["articleStatus"]): HTMLAttributes<HTMLAnchorElement>['className'] => {
	switch (status) {
	  case 'Approved':
		return 'bg-green-500';
	  case 'Pending Revision':
		return 'bg-yellow-500';
	  case 'Rejected':
	  case 'Submitted':
		return 'bg-blue-500';
	  case 'In Review':
		return 'bg-purple-500';
	  case 'Published':
		return 'bg-green-700';
	  case 'Archived':
		return 'bg-gray-700';
	  case 'Incomplete':
		return 'bg-orange-500';
	  case 'Under Review':
		return 'bg-indigo-500';
	  case 'Approved with Changes':
		return 'bg-teal-500';
	  case 'Withdrawn':
		return 'bg-pink-500';
	  case 'Scheduled for Publication':
		return 'bg-cyan-500';
	  case 'Needs More Information':
		return 'bg-yellow-700';
	  case 'Finalized':
		return 'bg-green-900';
	  case 'Draft':
		return 'bg-slate-200'
	  default:
		return 'bg-gray-500';
	}
  }
  