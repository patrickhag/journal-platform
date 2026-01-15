import { db } from '@/db/db';
import { issues, manuals, volumes } from '@/db/schema';
import { desc, eq } from 'drizzle-orm';

export const getPublishedVolumes = async () => {
  try {
    const result = await db.query.volumes.findMany({
      columns: {
        id: true,
        volumeNumber: true,
        year: true,
      },
      where: eq(volumes.status, 'Active'),
      with: {
        issues: {
          columns: {
            id: true,
            publicationDate: true,
            issueNumber: true,
          },
          where: eq(issues.status, 'Published'),
          orderBy: desc(issues.publicationDate),
          with: {
            articles: {
              columns: { id: true },
            },
          },
        },
      },
      orderBy: desc(volumes.year),
      limit: 5,
    });
    return { data: result, error: null };
  } catch (error) {
    return { data: null, error: 'Failed to fetch published volumes.' };
  }
};

export const getManual = async () => {
  try {
    const manual = await db.select().from(manuals).limit(1);
    return { data: manual, error: null };
  } catch (error) {
    return { data: null, error: 'Failed to fetch manuals.' };
  }
};

export const getMostViewed = async () => {
  try {
    const currentData = await db.query.metrics.findMany({
      columns: { id: true, views: true },
      with: {
        publishedArticle: {
          columns: { slug: true },
          with: {
            article: {
              columns: { id: true },
              with: {
                metadata: { columns: { title: true } },
              },
            },
          },
        },
      },
    });

    const topMetrics = currentData
      .sort((a, b) => (b.views ?? 0) - (a.views ?? 0))
      .slice(0, 3);

    return { data: topMetrics, error: null };
  } catch (error) {
    return { data: null, error: 'Failed to fetch most viewed articles.' };
  }
};
