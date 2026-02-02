import { auth } from '@/auth';
import { db } from '@/db/db';

import {
  articleSubmissions,
  editorActions,
  publishedArticles,
  reviewAssignments,
} from '@/db/schema';
import {
  notifyAllReviewersAboutFinalStatus,
  notifyUser,
  notifyUserAboutEditorDecision,
} from '@/lib/emailTransporter';
import { and, eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

type Params = { articleId: string };

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<Params> }
) {
  try {
    const session = await auth();

    const { decision, message } = await req.json();

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

    await db.insert(editorActions).values({
      articleId,
      decision,
      message,
      editorId: session.user.id as string,
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
        editorAssignment: {
          with: {
            user: {
              columns: {
                firstName: true,
                lastName: true,
              },
            },
          },
        },
      },
      where: eq(articleSubmissions.id, articleId),
    });

    await notifyUserAboutEditorDecision({
      article: article?.metadata.title as string,
      authorName: `${article?.user.firstName} ${article?.user.lastName}`,
      authorEmail: article?.user.email as string,
      articleLink: articleId,
      decision,
    });

    // QUERY ALL REVIEWERS ASSIGNED TO THIS ARTICLE IN CASE THE ARTICLE IS `ACCEPTED`

    const reviewAssignmentsReviewers =
      await db.query.reviewAssignments.findMany({
        where: and(
          eq(reviewAssignments.articleId, articleId),
          eq(reviewAssignments.status, 'ACCEPTED')
        ),
        with: {
          user: {
            columns: {
              email: true,
            },
          },
        },
      });

    const authorNames = article?.user.firstName + ' ' + article?.user.lastName;

    const assignedReviewers = reviewAssignmentsReviewers.map((r) => r.user);

    // UPDATE ALL REVIEW ASSIGNMENT STATUSES & INFORM THEM
    if (decision === 'ACCEPT' || decision === 'REJECT') {
      await db
        .update(reviewAssignments)
        .set({
          status: 'FINALIZED',
        })
        .where(eq(reviewAssignments.articleId, articleId));

      assignedReviewers.map(async (a) => {
        await notifyAllReviewersAboutFinalStatus({
          articleTitle: article?.metadata.title as string,
          authorNames: authorNames,
          status: decision,
          reviewerEmail: a?.email as string,
        });
      });
    }

    return NextResponse.json({
      message: 'Decision updated and author notified successfully!',
    });
  } catch (error) {
    console.error('Error sending editor decision:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<Params> }
) {
  try {
    const session = await auth();
    const { articleId } = await params;

    if (session?.user.role !== 'CHIEF_EDITOR') {
      return NextResponse.json(
        { message: 'Unauthorized user' },
        { status: 401 }
      );
    }

    if (!articleId) {
      return NextResponse.json(
        { error: 'Article ID is required' },
        { status: 400 }
      );
    }

    const isUpdatingDone = await db
      .update(publishedArticles)
      .set({
        status: 'PUBLISHED',
        publishedAt: new Date(),
      })
      .where(eq(publishedArticles.articleId, articleId))
      .returning();

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
      },
      where: eq(articleSubmissions.id, articleId),
    });

    const articleTitle = article?.metadata.title as string;
    const authorName = `${article?.user.firstName as string} ${article?.user.lastName as string}`;
    const authorEmail = article?.user.email as string;
    const articleLink = article?.id as string;

    if (isUpdatingDone[0]) {
      await notifyUser({
        articleTitle: articleTitle,
        authorName,
        authorEmail,
        articleLink: `${process.env.NEXT_PUBLIC_URL}/articles/article/${articleLink}`,
        type: 'published',
        subject: '🎉 Congratulations! Your Manuscript Is Officially Published',
      });

      return NextResponse.json({
        message: 'Manuscript is officially published!',
      });
    }
  } catch (error) {
    console.error('Error publishing accepted article:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
