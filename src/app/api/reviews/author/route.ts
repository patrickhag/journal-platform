import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db/db';
import { authorRevisions, reviews, users } from '@/db/schema';
import { auth } from '@/auth';
import { articleSubmissions } from '@/db/schema';
import { and, desc, eq } from 'drizzle-orm';
import { authorInformReviewer } from '@/lib/emailTransporter';

export async function GET(req: NextRequest) {
  try {
    const session = await auth();

    const userId = session?.user.id;

    const reviewersReviews = await db.query.articleSubmissions.findMany({
      where: and(
        eq(articleSubmissions.userId, userId as string),
        eq(articleSubmissions.articleStatus, 'UNDER REVIEW')
      ),
      columns: {
        id: true,
        articleStatus: true,
      },
      with: {
        metadata: {
          columns: {
            title: true,
          },
        },
        reviews: {
          orderBy: desc(reviews.reviewedAt),
          columns: {
            id: true,
            articleId: true,
            reviewedAt: true,
            status: true,
            message: true,
            fileIds: true,
          },
          with: {
            user: {
              columns: {
                id: true,
                firstName: true,
                lastName: true,
                prefix: true,
                email: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json(reviewersReviews);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const { articleId, message, reviewerEmail, reviewerName, articleTitle } =
      await req.json();

    const session = await auth();
    const authorName = session?.user?.name;

    // send email to reviewer
    await authorInformReviewer({
      articleTitle: articleTitle as string,
      articleLink: articleId,
      authorName: authorName as string,
      message,
      reviewerEmail,
      reviewerName,
    });

    return NextResponse.json(
      { message: 'Reply sent successfully and reviewer informed' },
      { status: 201 }
    );
  } catch (error) {
    console.error('[REVIEWS_POST]', error);
    return NextResponse.json(
      { error: 'Something went wrong', details: error },
      { status: 400 }
    );
  }
}
