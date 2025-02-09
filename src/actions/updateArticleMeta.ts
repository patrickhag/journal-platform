'use server';
import { metadataSchema } from '@/components/upload/ContributorsForm';
import { db, metadata } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { z } from 'zod';

export default async function updateArticleMeta({
  meta,
  articleId,
}: {
  meta: z.infer<typeof metadataSchema>;
  articleId: string;
}) {
  try {
    await db
      .update(metadata)
      .set({
        abstract: meta.abstract,
        title: meta.title,
        prefix: meta.prefix,
        subtitle: meta.subtitle,
        topics: meta.topics,
      })
      .where(eq(metadata.articleId, articleId));
  } catch (error) {
    if (error instanceof Error) return error.message;
  }
}
