import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db/db';
import { articleSubmissions, publishedArticles } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { auth } from '@/auth';

export async function GET(req: NextRequest) {
  try {
    const session = await auth();

    if (
      !(session?.user.role === 'ADMIN' || session?.user.role === 'CHIEF_EDITOR')
    ) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const editorsPicks = await db.query.publishedArticles.findMany({
      columns: {
        id: true,
        articlePicture: true,
        updatedAt: true,
      },
      with: {
        article: {
          columns: {
            id: true,
            section: true,
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
              },
            },
          },
        },
      },
      where: eq(publishedArticles.isEditorsPick, true),
    });

    return NextResponse.json(editorsPicks);
  } catch (error) {
    console.error('Error fetching editors picks:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const { articleIds, images } = await req.json();
    const session = await auth();

    if (
      !(session?.user.role === 'ADMIN' || session?.user.role === 'CHIEF_EDITOR')
    ) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!articleIds || !Array.isArray(articleIds) || articleIds.length === 0) {
      return NextResponse.json(
        { error: 'Article IDs are required' },
        { status: 400 }
      );
    }

    const results = [];

    for (const articleId of articleIds) {
      // Check if article is published
      const article = await db.query.articleSubmissions.findFirst({
        where: eq(articleSubmissions.id, articleId),
        columns: {
          articleStatus: true,
        },
      });

      if (article?.articleStatus !== 'PUBLISHED') {
        return NextResponse.json(
          {
            message: "Only published articles can be selected as editor's pick",
          },
          { status: 400 }
        );
      }

      // Check if publishedArticles record exists
      const existingPublishedArticle =
        await db.query.publishedArticles.findFirst({
          where: eq(publishedArticles.articleId, articleId),
          columns: {
            id: true,
          },
        });

      const imageUrl = images?.[articleId] || null;

      if (!imageUrl) {
        return NextResponse.json(
          {
            message: `Image is required for article ${articleId}`,
          },
          { status: 400 }
        );
      }

      if (existingPublishedArticle) {
        // Update existing publishedArticles record
        await db
          .update(publishedArticles)
          .set({
            articlePicture: imageUrl,
            isEditorsPick: true,
            updatedAt: new Date(),
          })
          .where(eq(publishedArticles.articleId, articleId));
      } else {
        // Create new publishedArticles record if it doesn't exist
        // Get article info for userId
        const articleInfo = await db.query.articleSubmissions.findFirst({
          where: eq(articleSubmissions.id, articleId),
          columns: {
            userId: true,
          },
        });

        await db.insert(publishedArticles).values({
          articleId,
          articlePicture: imageUrl,
          isEditorsPick: true,
          status: 'PUBLISHED',
          userId: articleInfo?.userId || null,
        });
      }

      results.push(articleId);
    }

    if (results.length === articleIds.length) {
      return NextResponse.json(
        { message: 'Article(s) picked successfully' },
        { status: 201 }
      );
    } else {
      return NextResponse.json(
        {
          message: 'Some articles may not have been updated',
        },
        { status: 207 }
      );
    }
  } catch (error) {
    console.error('Error picking articles:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { articleId } = await req.json();
    const session = await auth();

    if (
      !(session?.user.role === 'ADMIN' || session?.user.role === 'CHIEF_EDITOR')
    ) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!articleId) {
      return NextResponse.json(
        { error: 'Article ID is required' },
        { status: 400 }
      );
    }

    // Remove from editor's pick by updating publishedArticles
    const updatedArticle = await db
      .update(publishedArticles)
      .set({ isEditorsPick: false, updatedAt: new Date() })
      .where(eq(publishedArticles.articleId, articleId))
      .returning();

    if (updatedArticle.length > 0) {
      return NextResponse.json(
        { message: 'Article removed successfully' },
        { status: 201 }
      );
    } else {
      return NextResponse.json(
        { error: 'Published article not found' },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error("Error removing article from editor's pick:", error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
