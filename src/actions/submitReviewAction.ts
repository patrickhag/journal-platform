'use server';
import { auth } from '@/auth';
import { db, reviews } from '@/db/schema';

import { reviewSchema } from '@/schemas/reviewer';

import { RedirectType, redirect } from 'next/navigation';

export async function submitReviewAction(_: unknown, formData: FormData) {
  const data = Object.fromEntries(formData.entries());
  console.log(data);
  const result = reviewSchema.safeParse(data);

  if (!result.success) {
    return result.error.errors;
  }

  const session = await auth();
  const userId = session?.user?.id || '';
  try {
    await db.insert(reviews).values({
      userId: userId,
      message: result.data.message,
      articleId: result.data.articleId,
      fileIds: JSON.parse(result.data.fileIds),
    });
  } catch (error) {
    if (error instanceof Error) return { message: error.message };
  }

  redirect(`/articles/${result.data.articleId}`, RedirectType.push);
}
