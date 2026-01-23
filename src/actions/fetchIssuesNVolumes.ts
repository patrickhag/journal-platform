import { db } from '@/db/db';
import { issues, volumes } from '@/db/schema';
import { asc, desc, eq } from 'drizzle-orm';

export const getPublishedVolumesOnly = async () => {
  try {
    const foundIssuesNVolumes = await db.query.volumes.findMany({
      where: eq(volumes.status, 'Active'),
      columns: {
        id: true,
        volumeNumber: true,
        year: true,
      },
      with: {
        issues: {
          columns: {
            id: true,
            publicationDate: true,
            issueNumber: true,
          },
          where: eq(issues.status, 'Published'),
          orderBy: desc(issues.issueNumber),
          with: {
            articles: {
              columns: {
                id: true,
              },
            },
          },
        },
      },
      orderBy: desc(volumes.year),
    });

    return { data: foundIssuesNVolumes };
  } catch (error: unknown) {
    const errorMsg = 'Failed to fetch published volumes';
    if (error instanceof Error && error.message) {
      console.error({ error: error.message });
    }
    return { error: errorMsg };
  }
};
