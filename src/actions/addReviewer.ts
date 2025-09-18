'use server';

import { db, reviewers } from '@/db/schema';
import { reviewerSchema } from '@/schemas/reviewer';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

export async function addReviewerAction(
  _: unknown,
  formData: z.infer<typeof reviewerSchema> & { articleId: string }
) {
  try {
    await db
      .insert(reviewers)
      .values({ ...formData })
      .execute();
    revalidatePath('/articles/' + formData.articleId);

    return {
      success: true,
      message: 'Reviewer added successfully!',
    };
  } catch (error) {
    console.error('Error adding reviewer:', error);
    return {
      success: false,
      message: 'Failed to add reviewer. Please try again.',
    };
  }
}
