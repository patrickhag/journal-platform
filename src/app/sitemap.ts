import { articleSubmissions, db } from '@/db/schema';
import type { MetadataRoute } from 'next';
import { eq } from 'drizzle-orm';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const articles = await db
    .select()
    .from(articleSubmissions)
    .where(eq(articleSubmissions.articleStatus, 'Published'));

  const articlesUrls = articles.map((article) => ({
    url: `${process.env.NEXT_PUBLIC_URL}/articles/${article.id}`,
    lastModified: article.createdAt ? new Date(article.createdAt) : new Date(),
    priority: 1,
  }));

  return [
    {
      url: `${process.env.NEXT_PUBLIC_URL}`,
      lastModified: new Date(),
      priority: 1,
    },
    ...articlesUrls,
  ];
}
