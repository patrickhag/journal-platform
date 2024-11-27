"use client";
import { contributorFormSchema } from "@/schemas/upload";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { z } from "zod";
import { safeParse, serialize } from "zod-urlsearchparams";
import { Button } from "./ui/button";

export const Contributors = () => {
	const searchParams = useSearchParams();
	const validation = safeParse({
		schema: z.object({
			contributors: z.array(contributorFormSchema),
		}),
		input: new URLSearchParams(searchParams.toString()),
	});
	const router = useRouter();
	const { data: session } = useSession();
	return (
		<table className="w-full">
			<thead>
				<tr className="border-b text-left">
					<th className="pb-2 pr-4">Name</th>
					<th className="pb-2 pr-4">Homepage</th>
					<th className="pb-2 pr-4">Role</th>
					<th className="pb-2 pr-4">Email</th>
					<th className="pb-2 pr-4" />
				</tr>
			</thead>
			<tbody>
				<tr>
					<td>{session?.user?.name}</td>
					<td></td>
					<td>Author</td>
					<td>{session?.user?.email}</td>
					<td></td>
					<td></td>
				</tr>
				{validation.data?.contributors.map((c) => (
					<tr key={c.homepage + c.name} className="border-b">
						<td className="py-2 pr-4">{c.name}</td>
						<td className="py-2 pr-4">{c.homepage}</td>
						<td className="py-2 pr-4">{c.role}</td>
						<td className="py-2 pr-4">{c.email}</td>
						<td className="py-2 pr-4">
							<Button
								variant={"outline"}
								onClick={() => {
									const contributors = validation.data.contributors.filter(
										(contributor) => contributor.email !== contributor.email,
									);
									const serializedData = serialize({
										data: { contributors },
										schema: z.object({
											contributors: z.array(contributorFormSchema),
										}),
									});
									const params = new URLSearchParams(searchParams.toString());

									params.delete("contributors");
									router.push(
										`?${params.toString()}&${serializedData.toString()}`,
									);
								}}
							>
								Delete
							</Button>
						</td>
					</tr>
				))}
			</tbody>
		</table>
	);
};
