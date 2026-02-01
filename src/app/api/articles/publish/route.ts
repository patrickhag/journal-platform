import { auth } from '@/auth';
import { db } from '@/db/db';
import { articleSubmissions, issues, publishedArticles } from '@/db/schema';
import { informChiefEditorAboutOngoingPublication } from '@/lib/emailTransporter';
import { slugify } from '@/lib/utils';
import { asc, eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const allIssues = await db.query.issues.findMany({
      where: eq(issues.status, 'Published'),
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
      orderBy: asc(issues.issueNumber),
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

    let isPublishedArticleInserted: {
      id: string;
    }[];

    const {
      articleId,
      issueId,
      doi,
      pageRange,
      references,
      pdfUrl,
      title,
      issueNumber,
      volumeYear,
    } = body;

    // Check if DOI is provided and if it is already used by another article
    if (doi) {
      const existing = await db.query.publishedArticles.findFirst({
        where: (fields, { and, eq, ne }) =>
          and(
            eq(fields.doi, doi),
            // Only consider a DOI collision if it's used for a different article, or, prevent duplicate for same article as well
            ne(fields.articleId, articleId)
          ),
      });
      if (existing) {
        return NextResponse.json(
          { message: 'DOI already in use by another article.' },
          { status: 400 }
        );
      }
    }

    if (!pdfUrl) {
      isPublishedArticleInserted = await db
        .update(publishedArticles)
        .set({
          issueId,
          doi,
          pageRange,
          references,
          slug: slugify(title),
          status: 'AWAITING DECISION',
        })
        .where(eq(publishedArticles.articleId, articleId))
        .returning({ id: publishedArticles.id });
    } else {
      isPublishedArticleInserted = await db
        .insert(publishedArticles)
        .values({
          articleId,
          issueId,
          doi,
          pageRange,
          references,
          pdfUrl,
          slug: slugify(title),
          status: 'AWAITING DECISION',
        })
        .returning();
    }

    if (isPublishedArticleInserted.length !== 0) {
      await db
        .update(articleSubmissions)
        .set({ articleStatus: 'AWAITING DECISION' })
        .where(eq(articleSubmissions.id, articleId));

      const article = await db.query.articleSubmissions.findFirst({
        where: eq(articleSubmissions.id, articleId),
        columns: {
          id: true,
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
      });

      const authorNames = `${article?.metadata.prefix} ${article?.user.firstName} ${article?.user.lastName}`;

      await informChiefEditorAboutOngoingPublication({
        articleTitle: article?.metadata.title as string,
        authorNames: authorNames,
        issueNumber: issueNumber,
        volumeYear: volumeYear,
      });
      return NextResponse.json({
        message:
          "Article status changed, It's ready for chief-editor approval.",
      });
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error('[PUBLISH_ARTICLE_POST_ERROR]', error.message);
      return NextResponse.json(
        {
          error: 'Failed to publish article',
          details: (error as Error).message,
        },
        { status: 500 }
      );
    }
  }
}
