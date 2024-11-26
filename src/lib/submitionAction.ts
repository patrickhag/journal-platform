"use server";
import { auth } from "@/auth";
import type { metadataSchema } from "@/components/upload/ContributorsForm";
import {
	articleSubmissions,
	contributors,
	db,
	files,
	metadata,
	reviewers,
} from "@/db/schema";
import {
	type articleSubmitionSchema,
	type fileSchema,
	finalSubmissionSchema,
	type reviewerSchema,
} from "@/schemas/reviewer";
import type { contributorFormSchema } from "@/schemas/upload";
import { RedirectType, redirect } from "next/navigation";
import type * as z from "zod";

export async function submitAction(_: unknown, formData: FormData) {
	const data = Object.fromEntries(formData.entries());
	const result = finalSubmissionSchema.safeParse(data);

	if (!result.success) {
		console.error(result.error.errors);
		return;
	}
	const metadataValidations = JSON.parse(
		data.metadataValidations.toString(),
	) as z.infer<typeof metadataSchema>;
	const reviewerValidations = JSON.parse(
		data.reviewerValidations.toString(),
	) as z.infer<typeof reviewerSchema>[];
	const articleSubmitionValidations = JSON.parse(
		data.articleSubmitionValidations.toString(),
	) as z.infer<typeof articleSubmitionSchema>;
	const filesValidations = JSON.parse(
		data.filesValidations.toString(),
	) as z.infer<typeof fileSchema>[];
	const contributorValidations = JSON.parse(
		data.contributorValidations.toString(),
	) as z.infer<typeof contributorFormSchema>[];

	try {
		await db.transaction(async (trx) => {
			const session = await auth();
			const userId = session?.user?.id || "";

			const articleSubmissionIds = await trx
				.insert(articleSubmissions)
				.values({
					...articleSubmitionValidations,
					commentsForEditor:
						articleSubmitionValidations["Comments for the editor"],
					userId: userId,
				})
				.returning({ id: articleSubmissions.id });

			const insert = async <T>(
				vals: T[],
				// @ts-expect-error any
				t,
			) => {
				for (const v of vals) {
					const ids = await trx
						.insert(t)
						.values({
							...v,
							userId: userId,
							articleId: articleSubmissionIds[0].id,
						})
						.returning({ id: t.id });
					console.log(v, ids);
				}
			};

			await insert(reviewerValidations, reviewers);
			await insert(filesValidations, files);
			await insert(contributorValidations, contributors);
			await insert(reviewerValidations, reviewers);
			await trx.insert(metadata).values({
				...metadataValidations,
				articleId: articleSubmissionIds[0].id,
				userId: userId,
			});
		});
	} catch (error) {
		console.error("Weeerror", error);
		return { message: "Failed to submit" };
	}

	redirect("/dashboard", RedirectType.push);
}
