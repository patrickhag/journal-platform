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
  users,
} from '@/db/schema';
import {
  notifyAdmin,
  notifyContibutor,
  thankAuthorAboutSubmission,
} from '@/lib/emailTransporter';

import {
  type articleSubmitionSchema,
  type fileSchema,
  finalSubmissionSchema,
  type reviewerSchema,
} from '@/schemas/reviewer';

import type { contributorFormSchema } from '@/schemas/upload';
import { RedirectType, redirect } from 'next/navigation';
import type * as z from 'zod';
import { eq, ilike } from 'drizzle-orm';

export async function submitAction(_: unknown, formData: FormData) {
  const data = Object.fromEntries(formData.entries());
  const result = finalSubmissionSchema.safeParse(data);

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

  try {
    const session = await auth();
    if (!session) {
      return { message: 'Unauthorized' };
    }

    const userId = session?.user?.id;
    const userEmail = await db
      .select({ email: users.email })
      .from(users)
      .where(eq(users.id, userId));

    // Check for duplicate title BEFORE any database inserts
    const existingMetadata = await db
      .select()
      .from(metadata)
      .where(ilike(metadata.title, metadataValidations.title));

    if (existingMetadata.length > 0) {
      return {
        message: 'Seems like you have already submitted this manuscript.',
        errorType: 'duplicate',
      };
    }

    await db.transaction(async (trx) => {
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

      // notify editor-in-chief email
      await notifyAdmin({
        article: metadataValidations.title,
        authorName: session.user.name,
        subject: 'New Article Submission',
        articleId: articleSubmissionIds[0].id,
        participant: 'AUTHOR',
      });
    });

    // thank author email
    await thankAuthorAboutSubmission({
      articleTitle: metadataValidations.title,
      authorNames: session.user.name,
      authorEmail: userEmail[0]?.email as string,
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

    redirect('/submissions', RedirectType.push);
  } catch (error) {
    console.error('submission-error', error);

    // Determine error type based on error message
    let errorType = 'submission_failed';

    if (error instanceof Error) {
      if (
        error.message.includes('duplicate') ||
        error.message.includes('already exists')
      ) {
        errorType = 'duplicate';
      } else if (
        error.message.includes('validation') ||
        error.message.includes('invalid')
      ) {
        errorType = 'validation_error';
      } else if (
        error.message.includes('network') ||
        error.message.includes('timeout')
      ) {
        errorType = 'network_error';
      }
    }

    return {
      message: 'Failed to submit. Please try again.',
      errorType,
    };
  }
}
