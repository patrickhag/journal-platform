import { auth } from '@/auth';
import { db } from '@/db/db';
import { articleSubmissions, publishedArticles } from '@/db/schema';
import { slugify } from '@/lib/utils';
import { eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
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
    const session = await auth();

    if (
      !(
        session?.user.role === 'STAFF_EDITOR' ||
        session?.user.role === 'CHIEF_EDITOR'
      )
    ) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const body = await req.json();

    const { articleId, issueId, doi, pageRange, pdfUrl, title } = body;

    if (!pdfUrl) {
      await db
        .update(publishedArticles)
        .set({
          issueId,
          doi,
          pageRange,
          slug: slugify(title),
          status: 'AWAITING_DECISION',
        })
        .where(eq(publishedArticles.articleId, articleId));
    } else {
      await db.insert(publishedArticles).values({
        articleId,
        issueId,
        doi,
        pageRange,
        pdfUrl,
        slug: slugify(title),
        status: 'AWAITING_DECISION',
      });
    }
    await db
      .update(articleSubmissions)
      .set({ articleStatus: 'AWAITING_DECISION' })
      .where(eq(articleSubmissions.id, articleId));

    return NextResponse.json({
      message: "Article status changed, It's ready for chief-editor approval.",
    });
  } catch (error) {
    console.error('[PUBLISH_ARTICLE_POST_ERROR]', error);
    return NextResponse.json(
      { error: 'Failed to publish article', details: (error as Error).message },
      { status: 500 }
    );
  }
}
