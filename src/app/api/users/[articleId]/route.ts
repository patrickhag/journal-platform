import { auth } from '@/auth';
import { db } from '@/db/db';

import { articleRevisions, articleSubmissions } from '@/db/schema';
import { notifyEditorAboutRevision } from '@/lib/emailTransporter';
import { eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

type Params = { articleId: string };

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<Params> }
) {
  try {
    const session = await auth();

    const { fileIds, message } = await req.json();

    const { articleId } = await params;

    if (!articleId) {
      return NextResponse.json(
        { error: 'Article ID is required' },
        { status: 400 }
      );
    }

    await db.insert(articleRevisions).values({
      articleId,
      note: message,
      fileIds,
      submittedBy: session?.user.id as string,
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

    const authorNames = article?.user.firstName + ' ' + article?.user.lastName;
    await notifyEditorAboutRevision({
      authorName: authorNames,
      articleLink: article?.id as string,
      articleTitle: article?.metadata.title as string,
      type: 'AUTHOR',
    });

    return NextResponse.json({
      message: 'Decision updated and editor notified successfully!',
    });
  } catch (error) {
    console.error('Error sending editor decision:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
