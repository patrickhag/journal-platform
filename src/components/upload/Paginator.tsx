"use client";
import { ParsedUrlQueryInput } from "querystring";
import { cn } from "@/lib/utils";
import {
	articleSubmitionSchema,
	filesSchema,
	reviewerSchema,
} from "@/schemas/reviewer";
import { contributorFormSchema } from "@/schemas/upload";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import React, { type FC } from "react";
import { z } from "zod";
import { safeParse } from "zod-urlsearchparams";
import { metadataSchema } from "./ContributorsForm";

export const Paginator: FC<{
	backLink?: string;
	nextLink?: string;
	query?: string | ParsedUrlQueryInput | null;
}> = ({ nextLink, backLink, query }) => {
	const pathname = usePathname();
	const page = pathname.split("/").at(-1);

	const searchParams = useSearchParams();
	const articleSubmitionValidations = safeParse({
		input: new URLSearchParams(searchParams),
		schema: articleSubmitionSchema,
	});

	const metadataValidations = safeParse({
		input: new URLSearchParams(searchParams),
		schema: metadataSchema,
	});

	const reviewerValidations = safeParse({
		input: new URLSearchParams(searchParams),
		schema: z.object({
			reviewers: z.array(reviewerSchema),
		}),
	});

	const filesValidations = safeParse({
		input: new URLSearchParams(searchParams),
		schema: filesSchema,
	});
	const contributorValidations = safeParse({
		input: new URLSearchParams(searchParams),
		schema: z.object({
			contributors: z.array(contributorFormSchema),
		}),
	});
	const isAllowedToNext = () => {
		switch (page) {
			case "start":
				return articleSubmitionValidations.success;
			case "meta":
				return (
					metadataValidations.success &&
					contributorValidations.success &&
					contributorValidations.data?.contributors.length > 0
				);
			case "reviewer":
				return (
					reviewerValidations.success &&
					reviewerValidations.data?.reviewers.length > 0
				);
			case "attach-files":
				return (
					filesValidations.success &&
					filesValidations.data.files.length > 0 &&
					filesValidations.data.files.every((f) => !!f.fileType)
				);
		}
	};
	return (
		<div>
			<p className="mb-4 text-sm text-gray-500">* Denotes a required field</p>

			<div className="flex justify-between">
				{backLink && (
					<Link
						href={query ? { pathname: backLink, query } : backLink}
						className="px-4 py-1 ring-2 ring-gray-100 bg-white rounded-md"
					>
						Back
					</Link>
				)}
				{nextLink && (
					<Link
						href={{ pathname: nextLink, query }}
						className={cn(
							isAllowedToNext() ? "" : "pointer-events-none",
							"px-4 py-1 ring-2 ring-gray-100 bg-white rounded-md",
						)}
					>
						Next
					</Link>
				)}
			</div>
		</div>
	);
};
