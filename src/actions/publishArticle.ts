'use server';

import { db } from '@/db/db';
import { articleSubmissions } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { ARTICLE_STATUS } from '@/lib/consts';

type PublishArticleParams = {
  articleId: string;
  status: (typeof ARTICLE_STATUS)[number];
};

export const publishArticle = async ({
  articleId,
  status,
}: PublishArticleParams): Promise<{ success: boolean; error?: string }> => {
  try {
    await db
      .update(articleSubmissions)
      .set({
        articleStatus: status === 'Published' ? 'Submitted' : 'Published',
        updatedAt: new Date().toISOString(),
      })
      .where(eq(articleSubmissions.id, articleId));

    revalidatePath('/articles/' + articleId);
    return { success: true };
  } catch (error) {
    console.error('Error publishing article:', error);
    return {
      success: false,
      error: 'Failed to publish article',
    };
  }
};
