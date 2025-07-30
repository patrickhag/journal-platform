import { auth } from '@/auth';
import { db } from '@/db/db';

import {
  articleSubmissions,
  editorActions,
  notifications,
  publishedArticles,
  reviewRevisions,
} from '@/db/schema';
import {
  informChiefEditorAboutAcceptance,
  notifyEditorAboutRevision,
  notifyUser,
  notifyUserAboutEditorDecision,
} from '@/lib/emailTransporter';
import { eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

type Params = { articleId: string };

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<Params> }
) {
  try {
    const session = await auth();

    const { decision, fileId, message } = await req.json();

    if (
      !(
        session?.user.role === 'CHIEF_EDITOR' ||
        session?.user.role === 'ASSOCIATE_EDITOR'
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
      editorfileId: fileId,
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
            role: true,
          },
        },
        editor: {
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
      fileIds: fileId,
    });

    switch (decision) {
      case decision === 'ACCEPT':
        await db.insert(notifications).values({
          message:
            '🎉 Congratulations, your manuscript has been accepted by Associate editor.',
          userId: article?.user.id,
        });
        break;
      case decision === 'REQUEST_REVISION':
        await db.insert(notifications).values({
          message:
            'Associate-editor has requested a revision of your manuscript.',
          userId: article?.user.id,
        });
      case decision === 'REJECT':
        await db.insert(notifications).values({
          message:
            'The Peer-review team has rejected your manuscript. Check your email for more info.',
          userId: article?.user.id,
        });
        break;
      default:
        break;
    }

    // const associateEditorName =
    //   article?.editor?.user.firstName + ' ' + article?.editor?.user.lastName;
    // const authorNames = article?.user.firstName + ' ' + article?.user.lastName;

    // if (decision === 'ACCEPT') {
    //   await informChiefEditorAboutAcceptance({
    //     articleLink: article?.id as string,
    //     articleTitle: article?.metadata.title as string,
    //     associateEditorName: associateEditorName,
    //     authorNames: authorNames,
    //     authorEmail: article?.user.email as string,
    //   });
    //   await db.insert(notifications).values({
    //     message: `Manuscript by the name of ${article?.metadata.title} has been accepted by associate-editor and it's ready for proof-reading.`,
    //     userId: process.env.EDITOR_IN_CHIEF_ID,
    //   });
    // }

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

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<Params> }
) {
  try {
    const session = await auth();
    const { articleId } = await params;

    const { fileIds, message, reviewerUserId, reviewerName, reviewerEmail } =
      await req.json();

    if (
      !(
        session?.user.role === 'CHIEF_EDITOR' ||
        session?.user.role === 'ASSOCIATE_EDITOR'
      )
    ) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!articleId) {
      return NextResponse.json(
        { error: 'Article ID is required' },
        { status: 400 }
      );
    }

    await db.insert(reviewRevisions).values({
      articleId,
      fileIds,
      reviewerId: reviewerUserId,
      note: message,
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
            role: true,
          },
        },
      },
      where: eq(articleSubmissions.id, articleId),
    });

    await notifyEditorAboutRevision({
      articleTitle: article?.metadata.title as string,
      authorName: `${article?.user.firstName} ${article?.user.lastName}`,
      articleLink: articleId,
      reviewerName,
      reviewerEmail: reviewerEmail as string,
      type: 'REVIEWER',
    });

    await db.insert(notifications).values({
      message: `${article?.user.firstName} has submitted a revised manuscript for manuscript: "${article?.metadata.title as string}"`,
      userId: reviewerUserId as string,
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
      .where(eq(publishedArticles.id, articleId))
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

    await notifyUser({
      articleTitle: articleTitle,
      authorName,
      authorEmail,
      articleLink: `${process.env.NEXT_PUBLIC_URL}/articles/article/${articleLink}`,
      type: 'published',
      subject: '🎉 Congratulations! Your Manuscript Is Officially Published',
    });

    if (isUpdatingDone[0]) {
      return NextResponse.json({
        message: 'Manuscript is officially published!',
      });
    }
  } catch (error) {
    console.error('Error sending review revision:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
