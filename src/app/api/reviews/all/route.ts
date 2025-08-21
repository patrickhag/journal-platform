import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db/db';
import { desc, eq } from 'drizzle-orm';
import { auth } from '@/auth';
import { reviews } from '@/db/schema';

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
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
    });

    return NextResponse.json(completedReviews);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
