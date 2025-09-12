import { auth } from '@/auth';
import { db } from '@/db/db';
import { articleSubmissions, publishedArticles } from '@/db/schema';
import { desc, eq, or } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const foundPublishedArticles = await db.query.publishedArticles.findMany({
      where: or(
        eq(publishedArticles.status, 'AWAITING_DECISION'),
        eq(publishedArticles.status, 'PUBLISHED')
      ),
      orderBy: desc(publishedArticles.publishedAt),
      columns: {
        id: true,
        doi: true,
        publishedAt: true,
        status: true,
        pageRange: true,
      },
      with: {
        article: {
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
        },
        issue: {
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
        },
      },
    });

    return NextResponse.json(foundPublishedArticles);
  } catch (error) {
    console.error('Error creating volume:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await auth();

    if (session?.user.role !== 'CHIEF_EDITOR') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();

    const {
      publishedArticleId,
      articleId,
      pdfUrl,
      issueId,
      doi,
      pageRange,
      status,
    } = body;

    const existingPublishedArticle = await db.query.publishedArticles.findFirst(
      {
        where: eq(publishedArticles.id, publishedArticleId),
        columns: {
          id: true,
          issueId: true,
          doi: true,
        },
      }
    );

    if (!existingPublishedArticle) {
      return NextResponse.json(
        { error: 'Published article not found' },
        { status: 404 }
      );
    }

    // Check if DOI is unique (if provided and different from current)
    if (doi && doi === existingPublishedArticle.doi) {
      return NextResponse.json(
        { error: 'DOI already exists for another article' },
        { status: 409 }
      );
    }

    const updateData: any = {
      issueId,
      doi: doi || null,
      pageRange,
      status,
      updatedAt: new Date(),
    };

    if (pdfUrl) {
      updateData.pdfUrl = pdfUrl;
    }

    await db
      .update(publishedArticles)
      .set(updateData)
      .where(eq(publishedArticles.id, publishedArticleId));

    if (status === 'UNPUBLISHED') {
      await db
        .update(articleSubmissions)
        .set({
          articleStatus: 'ARCHIVED',
        })
        .where(eq(articleSubmissions.id, articleId));
    }
    return NextResponse.json(
      {
        message: 'Published article updated successfully',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating published article:', error);
    if (error instanceof Error) {
      return NextResponse.json(
        { error: 'Failed to update published article', details: error.message },
        { status: 500 }
      );
    } else {
      return NextResponse.json(
        { error: 'Unknown server error' },
        { status: 500 }
      );
    }
  }
}
