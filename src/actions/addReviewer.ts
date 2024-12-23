'use server';
import { auth } from '@/auth';
import { db, reviewers } from '@/db/schema';
import { reviewerSchema } from '@/schemas/reviewer';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

export async function addReviewerAction(
  _: unknown,
  formData: z.infer<typeof reviewerSchema> & { articleId: string }
) {
  const session = await auth();
  const userId = session?.user?.id || '';

  await db
    .insert(reviewers)
    .values({ ...formData, userId })
    .execute();
  revalidatePath('/articles/' + formData.articleId);
}
