'use server';
import { auth } from '@/auth';
import { db, files } from '@/db/schema';

import { filesSchema } from '@/schemas/reviewer';

import { RedirectType, redirect } from 'next/navigation';

export const attachFile = async (_: unknown, formData: FormData) => {
  const data = Object.fromEntries(formData.entries());
  const result = filesSchema.safeParse(JSON.parse(data.files as string));
  console.log(result.data);

  if (!result.success || !result.data.files) {
    return result.error?.errors;
  }

  const session = await auth();
  const userId = session?.user?.id || '';
  try {
    for (const file of result.data.files) {
      await db.insert(files).values({
        ...file,
        articleId: data.articleId as string,
        userId: userId,
      });
    }
  } catch (error) {
    if (error instanceof Error) return { message: error.message };
  }

  redirect(`/articles/${data.articleId}`, RedirectType.push);
};
