import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db/db';
import { publishedArticles } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';

export async function GET(req: NextRequest) {
  try {
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
      limit: 5,
    });

    return NextResponse.json(foundPublishedArticles);
  } catch (error) {
    console.error('Error fetching published articles:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
