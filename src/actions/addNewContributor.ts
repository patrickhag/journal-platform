'use server';
import { auth } from '@/auth';
import { contributors, db } from '@/db/schema';
import { contributorFormSchema } from '@/schemas/upload';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

export default async function addNewContributor({
  data,
  articleId,
}: {
  data: z.infer<typeof contributorFormSchema>;
  articleId: string | undefined;
}) {
  const session = await auth();
  try {
    if (!articleId || !session?.user.id) return;
    await db.insert(contributors).values({ ...data, articleId });
    revalidatePath('/articles/' + articleId);
  } catch (error) {
    if (error instanceof Error) return error.message;
  }
}
