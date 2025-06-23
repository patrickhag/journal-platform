import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db/db';
import { articleSubmissions, metadata } from '@/db/schema';
import { and, eq } from 'drizzle-orm';
import { ARTICLE_STATUS } from '@/lib/consts';
import { auth } from '@/auth';

type Params = { userId: string };

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<Params> }
) {
  try {
    const { userId } = await params;
    const session = await auth();

    if (!userId || !session?.user?.role) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const searchQuery = searchParams.get('searchQuery')?.trim();
    const rawStatus = searchParams.get('articleStatus');

    const articleStatus = ARTICLE_STATUS.includes(rawStatus as any)
      ? (rawStatus as (typeof ARTICLE_STATUS)[number])
      : undefined;

    const whereClause = and(
      eq(articleSubmissions.userId, userId),
      ...(articleStatus
        ? [eq(articleSubmissions.articleStatus, articleStatus)]
        : [])
    );

    let articles = await db.query.articleSubmissions.findMany({
      where: whereClause,
      columns: {
        id: true,
        section: true,
        userId: true,
        proofStatus: true,
        createdAt: true,
        updatedAt: true,
        articleStatus: true,
      },
      with: {
        metadata: {
          columns: {
            title: true,
          },
        },
        editorActions: {
          columns: {
            editorfileId: true,
            decision: true,
            message: true,
          },
        },
      },
    });

    // Apply title search filter in JavaScript since title is in metadata table
    if (searchQuery) {
      articles = articles.filter((article) =>
        article.metadata?.title
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase())
      );
    }

    return NextResponse.json(articles);
  } catch (error) {
    console.error('Error fetching articles:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch articles',
        details: error instanceof Error ? error.message : null,
      },
      { status: 500 }
    );
  }
}
