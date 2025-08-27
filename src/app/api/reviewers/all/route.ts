import { auth } from '@/auth';
import { db } from '@/db/db';
import { reviewAssignments, reviews, userRoles } from '@/db/schema';
import { and, eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (
      !(
        session?.user.role === 'CHIEF_EDITOR' ||
        session?.user.role === 'ASSOCIATE_EDITOR'
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
          },
          with: {
            reviews: {
              columns: {
                id: true,
              },
            },
            reviewAssignments: {
              where: eq(reviewAssignments.status, 'ACCEPTED'),
              columns: {
                id: true,
                articleId: true,
                assignedDate: true,
                dueDate: true,
              },
              with: {
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
        session?.user.role === 'ASSOCIATE_EDITOR'
      )
    ) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { userId, articleId } = await req.json();

    if (!(userId || articleId)) {
      return NextResponse.json(
        { message: 'Invalid userId or articleId' },
        { status: 400 }
      );
    }

    const isItDeleted = await db
      .delete(reviewAssignments)
      .where(
        and(
          eq(reviewAssignments.articleId, articleId),
          eq(reviewAssignments.userId, userId)
        )
      )
      .returning();

    if (isItDeleted.length > 0) {
      return NextResponse.json(
        { message: 'Reviewer successfully unassigned from the article' },
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
