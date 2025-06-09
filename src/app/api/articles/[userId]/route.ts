import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db/db';
import { articleSubmissions, metadata, reviewAssignments } from '@/db/schema';
import { and, eq, ilike } from 'drizzle-orm';
import { ARTICLE_STATUS, articleFilters } from '@/lib/consts';
import { auth } from '@/auth';

type Params = { userId: string };

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<Params> }
) {
  try {
    const { userId } = await params;
    const { searchParams } = new URL(req.url);
    const session = await auth();
    const currentUserRole = session?.user?.role;

    if (!userId || !currentUserRole) {
      return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });
    }

    const searchQuery = searchParams.get('searchQuery');
    const rawStatus = searchParams.get('articleStatus');
    const rawType = searchParams.get('articleType');
    const articleStatus = ARTICLE_STATUS.includes(rawStatus as any)
      ? (rawStatus as (typeof ARTICLE_STATUS)[number])
      : undefined;
    const articleType = articleFilters.includes(rawType as any)
      ? (rawType as (typeof articleFilters)[number])
      : undefined;

    const validatedSearchQuery =
      typeof searchQuery === 'string' && searchQuery.trim()
        ? searchQuery.trim()
        : null;

    const whereConditions = [];

    // Handle article type filtering based on user role
    if (articleType === 'My articles') {
      whereConditions.push(eq(articleSubmissions.userId, userId));
    } else if (
      articleType === 'Assigned to review' &&
      currentUserRole === 'REVIEWER'
    ) {
      whereConditions.push(
        and(
          eq(reviewAssignments.articleId, articleSubmissions.id),
          eq(reviewAssignments.status, 'Accepted'),
          eq(reviewAssignments.userId, userId)
        )
      );
    } else if (!articleType) {
      if (
        currentUserRole === 'NORMAL_USER' ||
        currentUserRole === 'CHIEF_EDITOR'
      ) {
        whereConditions.push(eq(articleSubmissions.userId, userId));
      } else if (currentUserRole === 'REVIEWER') {
        whereConditions.push(
          and(
            eq(reviewAssignments.articleId, articleSubmissions.id),
            eq(reviewAssignments.status, 'Accepted'),
            eq(reviewAssignments.userId, userId)
          )
        );
      }
    }

    if (validatedSearchQuery) {
      whereConditions.push(ilike(metadata.title, `%${validatedSearchQuery}%`));
    }

    if (articleStatus) {
      whereConditions.push(eq(articleSubmissions.articleStatus, articleStatus));
    }

    const manuscript = await db
      .select({
        id: articleSubmissions.id,
        section: articleSubmissions.section,
        articleStatus: articleSubmissions.articleStatus,
        title: metadata.title,
        owner: articleSubmissions.userId,
        proofStatus: articleSubmissions.proofStatus,
      })
      .from(articleSubmissions)
      .where(whereConditions.length ? and(...whereConditions) : undefined)
      .leftJoin(
        reviewAssignments,
        eq(articleSubmissions.id, reviewAssignments.articleId)
      )
      .leftJoin(metadata, eq(articleSubmissions.id, metadata.articleId));

    return NextResponse.json(manuscript);
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
