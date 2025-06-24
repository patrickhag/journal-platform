import { auth } from '@/auth';
import { db } from '@/db/db';

import {
  articleSubmissions,
  editorActions,
  reviewRevisions,
} from '@/db/schema';
import {
  notifyEditorAboutRevision,
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

    if (session?.user.role !== 'CHIEF_EDITOR') {
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

    if (session?.user.role !== 'CHIEF_EDITOR') {
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
