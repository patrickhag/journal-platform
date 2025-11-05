import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db/db';
import { eq, count } from 'drizzle-orm';
import { articleSubmissions } from '@/db/schema';
import {
  parsePaginationParams,
  createPaginatedResponse,
} from '@/lib/pagination';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const { page, limit } = parsePaginationParams(searchParams, 5);

    // Get total count
    const [{ total }] = await db
      .select({ total: count() })
      .from(articleSubmissions)
      .where(eq(articleSubmissions.articleStatus, 'ACCEPTED'));

    // Get paginated articles
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
        files: {
          columns: {
            publicId: true,
          },
        },
      },
      where: eq(articleSubmissions.articleStatus, 'ACCEPTED'),
      limit: limit,
      offset: (page - 1) * limit,
    });

    return NextResponse.json(
      createPaginatedResponse(articles, total, page, limit)
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch articles' },
      { status: 500 }
    );
  }
}
