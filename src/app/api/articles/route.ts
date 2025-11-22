import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db/db';
import { eq, desc } from 'drizzle-orm';
import { articleSubmissions } from '@/db/schema';
import { auth } from '@/auth';

export async function GET(req: NextRequest) {
  try {
    const session = await auth();

    if (session?.user.role !== 'STAFF_EDITOR') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const articles = await db.query.articleSubmissions.findMany({
      columns: {
        id: true,
        createdAt: true,
        updatedAt: true,
        articleStatus: true,
        acceptedAt: true,
      },
      with: {
        user: {
          columns: {
            firstName: true,
            lastName: true,
            affiliation: true,
          },
        },
        metadata: {
          columns: {
            title: true,
            prefix: true,
            abstract: true,
          },
        },
        publishedArticle: {
          columns: {
            id: true,
            pdfUrl: true,
          },
        },
      },
      orderBy: desc(articleSubmissions.createdAt),
      where: eq(articleSubmissions.articleStatus, 'ACCEPTED'),
    });

    return NextResponse.json(articles);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch articles' },
      { status: 500 }
    );
  }
}
