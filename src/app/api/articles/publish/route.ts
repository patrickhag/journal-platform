import { auth } from '@/auth';
import { db } from '@/db/db';
import { articleSubmissions, publishedArticles } from '@/db/schema';
import { notifyUser } from '@/lib/emailTransporter';
import { slugify } from '@/lib/utils';
import { eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const session = await auth();

    if (
      !(session?.user.role === 'ADMIN' || session?.user.role === 'CHIEF_EDITOR')
    ) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const allIssues = await db.query.issues.findMany({
      columns: {
        id: true,
        issueNumber: true,
      },
      with: {
        volume: {
          columns: {
            year: true,
          },
        },
      },
    });

    return NextResponse.json(allIssues);
  } catch (error) {
    console.error('Error creating volume:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { articleId, issueId, doi, pageRange, pdfUrl, title } = body;

    await db.insert(publishedArticles).values({
      articleId,
      issueId,
      doi,
      pageRange,
      pdfUrl,
      slug: slugify(title),
    });

    await db
      .update(articleSubmissions)
      .set({ articleStatus: 'PUBLISHED' })
      .where(eq(articleSubmissions.id, articleId));

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

    return NextResponse.json({
      message: 'Article published and author was informed.',
    });
  } catch (error) {
    console.error('[PUBLISH_ARTICLE_POST_ERROR]', error);
    return NextResponse.json(
      { error: 'Failed to publish article', details: (error as Error).message },
      { status: 500 }
    );
  }
}
