import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { db } from '@/db/db';
import { articleSubmissions, reviewRevisions, reviews } from '@/db/schema';
import { notifyReviewerAboutReReview } from '@/lib/emailTransporter';
import { eq } from 'drizzle-orm';

export async function PUT(req: NextRequest) {
  try {
    const session = await auth();

    if (
      !(
        session?.user.role === 'CHIEF_EDITOR' ||
        session?.user.role === 'STAFF_EDITOR'
      )
    ) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const {
      fileIds,
      message,
      reviewerName,
      reviewerEmail,
      reviewId,
      articleTitle,
      articleId,
    } = await req.json();

    await db.insert(reviewRevisions).values({
      reviewId,
      fileIds,
      message,
    });

    await db
      .update(articleSubmissions)
      .set({
        articleStatus: 'UNDER REVIEW',
      })
      .where(eq(articleSubmissions.id, articleId));

    // send email to the reviewer
    await notifyReviewerAboutReReview({
      reviewerName,
      reviewerEmail: reviewerEmail as string,
      articleTitle: articleTitle as string,
    });

    return NextResponse.json({
      message: 'Review revision updated and reviewer notified!',
    });
  } catch (error) {
    console.error('Error sending review revision:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
