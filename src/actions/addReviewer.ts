'use server';

import { db, reviewers } from '@/db/schema';
import { reviewerSchema } from '@/schemas/reviewer';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

export async function addReviewerAction(
  _: unknown,
  formData: z.infer<typeof reviewerSchema> & { articleId: string }
) {
  await db
    .insert(reviewers)
    .values({ ...formData })
    .execute();
  revalidatePath('/articles/' + formData.articleId);
}
