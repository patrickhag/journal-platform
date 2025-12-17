import { auth } from '@/auth';
import { db } from '@/db/db';
import { reviewAssignments, userRoles } from '@/db/schema';
import { remindReviewerAboutRevision } from '@/lib/emailTransporter';
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
      return NextResponse.json(
        { message: 'Unauthorized user' },
        { status: 401 }
      );
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
          },
          with: {
            reviewAssignments: {
              where: eq(reviewAssignments.status, 'ACCEPTED'),
              columns: {
                id: true,
                articleId: true,
                assignedDate: true,
                dueDate: true,
              },
              with: {
                reviews: {
                  columns: {
                    id: true,
                  },
                },
                article: {
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
                  },
                },
              },
            },
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

export async function PATCH(req: NextRequest) {
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

    const { userId, articleId, isItNotification } = await req.json();

    if (!(userId || articleId)) {
      return NextResponse.json(
        { message: 'Invalid userId or articleId' },
        { status: 400 }
      );
    }

    const reviewer = await db.query.reviewAssignments.findFirst({
      columns: {
        dueDate: true,
      },
      where: and(
        eq(reviewAssignments.userId, userId),
        eq(reviewAssignments.articleId, articleId)
      ),
      with: {
        user: {
          columns: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        article: {
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
        },
      },
    });

    if (isItNotification) {
      // send email to the reviewer
      await remindReviewerAboutRevision({
        toEmail: reviewer?.user?.email as string,
        articleTitle: reviewer?.article?.metadata.title as string,
        reviewerName: `${reviewer?.user?.firstName} ${reviewer?.user?.lastName}`,
        dueDate: reviewer?.dueDate as string,
      });
      return NextResponse.json(
        { message: 'Reviewer successfully notified' },
        { status: 200 }
      );
    }

    const isItDeleted = await db
      .update(reviewAssignments)
      .set({ status: 'DECLINED' })
      .where(
        and(
          eq(reviewAssignments.articleId, articleId),
          eq(reviewAssignments.userId, userId)
        )
      )
      .returning();

    if (isItDeleted.length > 0) {
      return NextResponse.json(
        { message: 'Reviewer successfully unassigned' },
        { status: 200 }
      );
    }
  } catch (error) {
    console.error('Error updating articles:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
