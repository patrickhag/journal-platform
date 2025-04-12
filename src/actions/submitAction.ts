'use server';

import { auth } from '@/auth';
import type { metadataSchema } from '@/components/upload/ContributorsForm';
import {
  articleSubmissions,
  contributors,
  db,
  files,
  finalSubmissions,
  metadata,
  reviewers,
} from '@/db/schema';
import { notifyContibutor, notifyAdmin } from '@/lib/emailTransporter';

import {
  type articleSubmitionSchema,
  type fileSchema,
  finalSubmissionSchema,
  type reviewerSchema,
} from '@/schemas/reviewer';

import type { contributorFormSchema } from '@/schemas/upload';
import { RedirectType, redirect } from 'next/navigation';
import type * as z from 'zod';

export async function submitAction(_: unknown, formData: FormData) {
  const data = Object.fromEntries(formData.entries());
  const result = finalSubmissionSchema.safeParse(data);
  console.log('data', data);
  if (!result.success) {
    console.error(result.error.errors);
    return;
  }
  const metadataValidations = JSON.parse(
    data.metadataValidations.toString()
  ) as z.infer<typeof metadataSchema>;
  const reviewerValidations = JSON.parse(
    data.reviewerValidations.toString()
  ) as z.infer<typeof reviewerSchema>[];
  const articleSubmitionValidations = JSON.parse(
    data.articleSubmitionValidations.toString()
  ) as z.infer<typeof articleSubmitionSchema>;
  const filesValidations = JSON.parse(
    data.filesValidations.toString()
  ) as z.infer<typeof fileSchema>[];
  const contributorValidations = JSON.parse(
    data.contributorValidations.toString()
  ) as z.infer<typeof contributorFormSchema>[];

  const session = await auth();
  let isError = false;

  try {
    const session = await auth();
    if (!session) {
      return { message: 'Unauthorized' };
    }

    await db.transaction(async (trx) => {
      const userId = session?.user?.id || '';

      const articleSubmissionIds = await trx
        .insert(articleSubmissions)
        .values({
          ...articleSubmitionValidations,
          commentsForEditor: articleSubmitionValidations[
            'Comments for the editor'
          ] as string,
          userId: userId,
        })
        .returning({ id: articleSubmissions.id });

      const insert = async <T>(
        vals: T[],
        // @ts-expect-error any
        t
      ) => {
        for (const v of vals) {
          await trx
            .insert(t)
            .values({
              ...v,
              userId: userId,
              articleId: articleSubmissionIds[0].id,
            })
            .returning({ id: t.id });
        }
      };

      await insert(reviewerValidations, reviewers);
      await insert(filesValidations, files);
      await insert(contributorValidations, contributors);
      await trx.insert(metadata).values({
        ...metadataValidations,
        articleId: articleSubmissionIds[0].id,
        userId: userId,
      });

      await trx.insert(finalSubmissions).values({
        articleId: articleSubmissionIds[0].id,
        funded: result.data.funded === 'yes',
        human: result.data.human === 'yes',
        ethical: result.data.ethical === 'yes',
        consent: result.data.consent === 'yes',
        founders: result.data.founders,
        ethicalReference: result.data.ethicalReference,
      });

      await notifyAdmin({
        article: metadataValidations.title,
        authorName: session.user.name || session.user.email || 'Unknown Author',
        subject: 'New Article Submission',
        articleId: articleSubmissionIds[0].id,
        participant: 'AUTHOR',
      });
    });

    for (const contributor of contributorValidations) {
      const originalAuthor = session?.user?.name;
      if (!originalAuthor) return;
      await notifyContibutor({
        url: process.env.NEXT_PUBLIC_URL || 'https://www.google.com',
        subject: 'Thank You for Your Contribution!',
        toEmail: contributor.email,
        article: metadataValidations.title,
        originalAuthor,
        contributor: contributor.name,
      });
    }

    isError = true;
  } catch (error) {
    console.error('Weeerror', error);
    return { message: 'Failed to submit' };
  }

  if (isError) redirect('/submissions', RedirectType.push);
}
