import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db/db';
import { desc, eq, count } from 'drizzle-orm';
import { auth } from '@/auth';
import { reviews } from '@/db/schema';
import {
  parsePaginationParams,
  createPaginatedResponse,
} from '@/lib/pagination';

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    const { searchParams } = new URL(req.url);
    const { page, limit } = parsePaginationParams(searchParams, 5);

    // Get total count
    const [{ total }] = await db
      .select({ total: count() })
      .from(reviews)
      .where(eq(reviews.userId, session?.user.id as string));

    const completedReviews = await db.query.reviews.findMany({
      where: eq(reviews.userId, session?.user.id as string),
      columns: {
        id: true,
        status: true,
        reviewedAt: true,
        message: true,
        fileIds: true,
      },
      with: {
        article: {
          columns: {
            id: true,
          },
          with: {
            user: {
              columns: {
                firstName: true,
                lastName: true,
              },
            },
            metadata: {
              columns: {
                title: true,
                prefix: true,
              },
            },
            authorRevisions: {
              columns: {
                message: true,
              },
            },
          },
        },
      },
      orderBy: desc(reviews.reviewedAt),
      limit: limit,
      offset: (page - 1) * limit,
    });

    return NextResponse.json(
      createPaginatedResponse(completedReviews, total, page, limit)
    );
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
