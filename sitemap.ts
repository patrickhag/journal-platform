import { db } from '@/db/db';
import { publishedArticles } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';

export default async function sitemap() {
  const foundPublishedArticles = await db.query.publishedArticles.findMany({
    where: eq(publishedArticles.status, 'PUBLISHED'),
    orderBy: desc(publishedArticles.publishedAt),
    columns: {
      id: true,
      publishedAt: true,
      slug: true,
      updatedAt: true,
    },
    with: {
      article: {
        columns: {
          id: true,
          section: true,
        },
        with: {
          metadata: {
            columns: {
              prefix: true,
              title: true,
              subtitle: true,
            },
          },
          user: {
            columns: {
              firstName: true,
              lastName: true,
            },
          },
        },
      },
    },
  });

  const seoPublishedArticles = foundPublishedArticles?.map(
    (publishedArticle) => {
      return {
        url: `${process.env.NEXT_PUBLIC_URL}/articles/article/${publishedArticle.slug}`,
        lastModified: publishedArticle.updatedAt,
      };
    }
  );

  const allCollections = await db.query.collections.findMany({
    orderBy: (collections, { desc }) => [desc(collections.createdAt)],
  });

  const seoAllCollections = allCollections?.map((collection) => {
    return {
      url: `${process.env.NEXT_PUBLIC_URL}/collections/${collection.slug}`,
      lastModified: collection.updatedAt,
    };
  });

  return [
    {
      url: process.env.NEXT_PUBLIC_URL,
    },
    {
      url: `${process.env.NEXT_PUBLIC_URL}/manuals`,
    },
    {
      url: `${process.env.NEXT_PUBLIC_URL}/collections`,
    },
    {
      url: `${process.env.NEXT_PUBLIC_URL}/editorial-board`,
    },
    ...(seoPublishedArticles || []),
    ...(seoAllCollections || []),
  ];
}
