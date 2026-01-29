import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { db } from '@/db/db';
import { articleSubmissions, reviewAssignments, reviews } from '@/db/schema';
import { and, eq, inArray } from 'drizzle-orm';
import { notifyReviewerAboutReReview } from '@/lib/emailTransporter';

type Params = { articleId: string };

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<Params> }
) {
  try {
    const session = await auth();

    if (
      !(
        session?.user.role === 'CHIEF_EDITOR' ||
        session?.user.role === 'STAFF_EDITOR'
      )
    ) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { articleId } = await params;

    if (!articleId) {
      return NextResponse.json(
        { error: 'Article ID is required' },
        { status: 400 }
      );
    }

    const article = await db.query.articleSubmissions.findFirst({
      columns: {
        id: true,
      },
      with: {
        metadata: {
          columns: {
            title: true,
          },
        },
      },
      where: eq(articleSubmissions.id, articleId),
    });

    if (!article) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    }

    const correctionReviews = await db.query.reviews.findMany({
      where: and(
        eq(reviews.articleId, articleId),
        inArray(reviews.status, ['Major Correction', 'Minor Correction'])
      ),
      with: {
        user: {
          columns: {
            firstName: true,
            lastName: true,
            email: true,
            prefix: true,
          },
        },
      },
    });

    const reviewerIds = correctionReviews
      .map((review) => review.userId)
      .filter((userId): userId is string => Boolean(userId));

    const [finalDecisionReviews] = await Promise.all([
      reviewerIds.length
        ? db.query.reviews.findMany({
            columns: { userId: true },
            where: and(
              eq(reviews.articleId, articleId),
              inArray(reviews.status, ['Accepted', 'Rejected']),
              inArray(reviews.userId, reviewerIds)
            ),
          })
        : Promise.resolve([]),
    ]);

    const blockedReviewerIds = new Set(
      [...finalDecisionReviews].map((record) => record.userId)
    );

    const eligibleCorrectionReviews = correctionReviews.filter(
      (review) => review.userId && !blockedReviewerIds.has(review.userId)
    );

    await db
      .update(articleSubmissions)
      .set({ articleStatus: 'UNDER REVIEW' })
      .where(eq(articleSubmissions.id, articleId));

    await Promise.all(
      eligibleCorrectionReviews
        .filter((review) => review.user?.email)
        .map((review) =>
          notifyReviewerAboutReReview({
            reviewerName:
              `${review.user?.prefix ? `${review.user.prefix}.` : ''} ${review.user?.firstName ?? ''} ${review.user?.lastName ?? ''}`.trim(),
            reviewerEmail: review.user?.email as string,
            articleTitle: article.metadata.title as string,
          })
        )
    );

    return NextResponse.json({
      message: 'Reviewers notified and article status updated to UNDER REVIEW.',
    });
  } catch (error) {
    console.error('Error forwarding corrections to reviewers:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
