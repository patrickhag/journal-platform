import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db/db';
import { reviewAssignments, reviews } from '@/db/schema';
import { auth } from '@/auth';
import { articleSubmissions, notifications } from '@/db/schema';
import { and, desc, eq } from 'drizzle-orm';
import { notifyAdmin, informingAuthorNReviewer } from '@/lib/emailTransporter';

export async function POST(req: Request) {
  try {
    const { message, articleId, fileIds, status } = await req.json();

    const session = await auth();
    const userId = session?.user?.id || '';

    await db.insert(reviews).values({
      message: message,
      articleId: articleId,
      fileIds: fileIds,
      status: status,
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
            id: true,
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
      where: eq(articleSubmissions.id, articleId),
    });

    const articleTitle = article?.metadata.title;
    const authorName = article?.user.firstName + ' ' + article?.user.lastName;
    const authorEmail = article?.user.email;

    // send email to author
    await informingAuthorNReviewer({
      articleTitle: articleTitle as string,
      participantName: authorName,
      participantEmail: authorEmail as string,
      subject: 'Reviewer has reviewed your manuscript and provided a review',
      userType: 'reviewer',
    });

    // send email to associate-editor also
    if (status === 'Accepted') {
      await notifyAdmin({
        article: articleTitle as string,
        authorName: session?.user?.name as string,
        subject: 'New Review Submitted',
        participant: 'REVIEWER',
        articleId: article?.id as string,
        associateEditorEmail: article?.editor?.user.email as string,
      });
    }

    // send in-app notification for author
    await db.insert(notifications).values({
      message: `New review submitted for your article named "${articleTitle}"`,
      userId: article?.user.id,
      kind: 'Info',
    });

    return NextResponse.json(
      { message: 'Review sent successfully and author informed' },
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
      orderBy: desc(reviewAssignments.assignedDate),
      where: and(
        eq(reviewAssignments.userId, session.user.id as string),
        eq(reviewAssignments.status, 'ACCEPTED')
      ),
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
    });
    // Filter articles that are past their due date and not published
    const dueArticles = assignedArticles.filter((article) => {
      const dueDate = new Date(article.dueDate as string);
      const currentDate = new Date();
      return (
        currentDate > dueDate && article?.article?.articleStatus !== 'PUBLISHED'
      );
    });

    return NextResponse.json({ assignedArticles, dueArticles });
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
