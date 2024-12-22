'use server';
import { db, articleFiles as files } from '@/db/schema';

import { filesSchema } from '@/schemas/reviewer';

import { RedirectType, redirect } from 'next/navigation';

export const attachFile = async (_: unknown, formData: FormData) => {
  const data = Object.fromEntries(formData.entries());
  const result = filesSchema.safeParse(JSON.parse(data.files as string));

  if (!result.success || !result.data.files) {
    return result.error?.errors;
  }

  try {
    for (const file of result.data.files) {
      await db.insert(files)
        .values(file);
    }
  } catch (error) {
    if (error instanceof Error) return { message: error.message };
  }

  redirect(`/articles/${data.articleId}`, RedirectType.push);
};
