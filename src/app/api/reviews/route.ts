import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db/db';
import { reviewAssignments, reviews } from '@/db/schema';
import { auth } from '@/auth';
import { articleSubmissions, notifications, users } from '@/db/schema';
import { and, eq } from 'drizzle-orm';
import { notifyAdmin } from '@/lib/emailTransporter';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const session = await auth();
    const userId = session?.user?.id || '';

    await db.insert(reviews).values({
      message: body.message,
      articleId: body.articleId,
      fileIds: body.fileIds,
      status: body.status,
      userId,
    });

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
        user: {
          columns: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        editor: {
          with: {
            user: {
              columns: {
                id: true,
                email: true,
              },
            },
          },
        },
      },
      where: eq(articleSubmissions.id, body.articleId),
    });

    const articleTitle = article?.metadata.title;

    // send email to admin
    await notifyAdmin({
      article: articleTitle as string,
      authorName: session?.user?.name as string,
      subject: 'New Review Submitted',
      participant: 'REVIEWER',
      articleId: article?.id as string,
      associateEditorEmail: article?.editor?.user.email as string,
    });

    // send in-app notification for admin
    await db.insert(notifications).values({
      message: `New review submitted for article named "${articleTitle}"`,
      userId: article?.editor?.user.id,
      kind: 'Info',
    });

    return NextResponse.json(
      { message: 'Review sent successfully and associate editor informed' },
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

export async function GET(req: NextRequest) {
  try {
    const session = await auth();

    if (session?.user.role !== 'REVIEWER') {
      return NextResponse.json(
        {
          error:
            'Access denied: Only reviewers are permitted to access this resources.',
        },
        { status: 401 }
      );
    }

    const assignedArticles = await db.query.reviewAssignments.findMany({
      columns: {
        id: true,
        assignedDate: true,
        dueDate: true,
        status: true,
      },
      where: and(eq(reviewAssignments.userId, session.user.id as string)),
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
                prefix: true,
              },
            },
            user: {
              columns: {
                firstName: true,
                lastName: true,
              },
            },
          },
        },
      },
      orderBy: (assignments) => [assignments.assignedDate],
    });

    return NextResponse.json(assignedArticles);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();

    if (!body.assignmentId) {
      return NextResponse.json(
        { message: 'Inviation not found!' },
        { status: 400 }
      );
    }

    const isAccepted = await db
      .update(reviewAssignments)
      .set({
        status: 'ACCEPTED',
      })
      .where(eq(reviewAssignments.id, body.assignmentId))
      .returning();

    if (isAccepted.length > 0) {
      return NextResponse.json(
        { message: 'Thank you for accepting the invitation!' },
        { status: 200 }
      );
    }
  } catch (error) {
    console.error('[REVIEWS_POST]', error);
    return NextResponse.json(
      { error: 'Something went wrong', details: error },
      { status: 400 }
    );
  }
}
