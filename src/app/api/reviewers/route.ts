import { auth } from '@/auth';
import { db } from '@/db/db';
import { articleSubmissions, reviewAssignments, userRoles } from '@/db/schema';
import { sendInvitation } from '@/lib/emailTransporter';
import { and, eq, inArray } from 'drizzle-orm';
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

    const [reviewers, editorRoles] = await Promise.all([
      db.query.userRoles.findMany({
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
      }),
      db.query.userRoles.findMany({
        columns: { userId: true },
        where: inArray(userRoles.role, ['STAFF_EDITOR', 'CHIEF_EDITOR']),
      }),
    ]);

    const editorUserIds = new Set(editorRoles.map((role) => role.userId));
    const eligibleReviewers = reviewers.filter(
      (reviewer) => !editorUserIds.has(reviewer.userId)
    );

    return NextResponse.json(eligibleReviewers);
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

    const [reviewerRole, isReviewerAlreadyAssigned, isEditorRole] =
      await Promise.all([
        db.query.userRoles.findFirst({
          columns: { id: true },
          where: and(
            eq(userRoles.userId, userId),
            eq(userRoles.role, 'REVIEWER')
          ),
        }),
        db.query.reviewAssignments.findFirst({
          where: and(
            eq(reviewAssignments.userId, userId),
            eq(reviewAssignments.articleId, articleId)
          ),
        }),
        db.query.userRoles.findFirst({
          columns: { id: true },
          where: and(
            eq(userRoles.userId, userId),
            inArray(userRoles.role, ['STAFF_EDITOR', 'CHIEF_EDITOR'])
          ),
        }),
      ]);

    if (!reviewerRole) {
      return NextResponse.json(
        { message: 'User is not a reviewer.' },
        { status: 400 }
      );
    }

    if (isEditorRole) {
      return NextResponse.json(
        { message: 'Editors cannot be assigned as reviewers.' },
        { status: 400 }
      );
    }

    if (isReviewerAlreadyAssigned) {
      return NextResponse.json(
        { message: 'Reviewer has already been invited to this article.' },
        { status: 409 }
      );
    }

    const [{ id: reviewAssignmentId }] = await db
      .insert(reviewAssignments)
      .values({
        articleId,
        userId,
        dueDate: date,
      })
      .returning({ id: reviewAssignments.id });

    // SET ARTICLE TO UNDER REVIEW
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

    // INFORM REVIEWER
    await sendInvitation({
      reviewerNames: reviewerName,
      articleId: articleId,
      toEmail: reviewerEmail,
      isAlreadyUser: true,
      dueDate: new Date(date as string).toISOString().split('T')[0],
      articleTitle: article?.metadata.title as string,
      abstract: article?.metadata.abstract as string,
      reviewAssignmentId: reviewAssignmentId,
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
