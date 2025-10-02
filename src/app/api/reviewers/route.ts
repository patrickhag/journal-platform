import { auth } from '@/auth';
import { db } from '@/db/db';
import { articleSubmissions, reviewAssignments, userRoles } from '@/db/schema';
import { sendInvitation } from '@/lib/emailTransporter';
import { format } from 'date-fns';
import { and, eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
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

    const reviewers = await db.query.userRoles.findMany({
      where: eq(userRoles.role, 'REVIEWER'),
      with: {
        user: {
          columns: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            affiliation: true,
            expertise: true,
            prefix: true,
            bio: true,
          },
        },
      },
    });

    return NextResponse.json(reviewers);
  } catch (error) {
    console.error('Error creating volume:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { articleId, reviewerName, reviewerEmail, date, userId } = body;

    const session = await auth();

    if (
      !(
        session?.user.role === 'CHIEF_EDITOR' ||
        session?.user.role === 'STAFF_EDITOR'
      )
    ) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const isReviewerAlreadyAssigned =
      await db.query.reviewAssignments.findFirst({
        where: and(
          eq(reviewAssignments.userId, userId),
          eq(reviewAssignments.articleId, articleId)
        ),
      });

    if (isReviewerAlreadyAssigned) {
      return NextResponse.json(
        { message: 'Reviewer has already been assigned to this article' },
        { status: 409 }
      );
    }

    await db.insert(reviewAssignments).values({
      articleId,
      userId,
      dueDate: date,
    });

    await db
      .update(articleSubmissions)
      .set({
        articleStatus: 'UNDER REVIEW',
      })
      .where(eq(articleSubmissions.id, articleId));

    const article = await db.query.articleSubmissions.findFirst({
      columns: {
        id: true,
      },
      with: {
        metadata: {
          columns: {
            title: true,
            abstract: true,
          },
        },
        user: {
          columns: {
            firstName: true,
            lastName: true,
          },
        },
      },
      where: eq(articleSubmissions.id, articleId),
    });

    await sendInvitation({
      reviewerNames: reviewerName,
      articleId: articleId,
      toEmail: reviewerEmail,
      isAlreadyUser: true,
      dueDate: new Date(date as string).toISOString().split('T')[0],
      articleTitle: article?.metadata.title as string,
      abstract: article?.metadata.abstract as string,
    });

    return NextResponse.json(
      {
        message: 'Reviewer assigned and informed successfully',
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error assigning reviewer:', error.message);
      return NextResponse.json(
        { message: 'Something went wrong' },
        { status: 500 }
      );
    } else {
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  }
}
