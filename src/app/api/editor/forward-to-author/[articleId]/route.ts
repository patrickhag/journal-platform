import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { db } from '@/db/db';
import { articleSubmissions } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { notifyUserAboutEditorDecision } from '@/lib/emailTransporter';

type Params = { articleId: string };

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<Params> }
) {
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

    const { articleId } = await params;

    if (!articleId) {
      return NextResponse.json(
        { error: 'Article ID is required' },
        { status: 400 }
      );
    }

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

    if (!article) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    }

    await db
      .update(articleSubmissions)
      .set({ articleStatus: 'CORRECTION' })
      .where(eq(articleSubmissions.id, articleId));

    await notifyUserAboutEditorDecision({
      article: article.metadata.title as string,
      authorName: `${article.user.firstName} ${article.user.lastName}`,
      authorEmail: article.user.email as string,
      articleLink: articleId,
      decision: 'REVISION',
    });

    return NextResponse.json({
      message: 'Corrections was forwarded and Author was informed.',
    });
  } catch (error) {
    console.error('Error forwarding corrections to author:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
