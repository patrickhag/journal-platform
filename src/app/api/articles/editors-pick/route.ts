import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db/db';
import { articleSubmissions } from '@/db/schema';
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

    const editorsPicks = await db.query.articleSubmissions.findMany({
      columns: {
        id: true,
        section: true,
        updatedAt: true,
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
      where: eq(articleSubmissions.isEditorsPick, true),
    });

    return NextResponse.json(editorsPicks);
  } catch (error) {
    console.error('Error creating volume:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { articleIds, articleId } = await req.json();
    const session = await auth();

    if (
      !(session?.user.role === 'ADMIN' || session?.user.role === 'CHIEF_EDITOR')
    ) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const updatedArticle = await db
      .update(articleSubmissions)
      .set({ isEditorsPick: false })
      .where(eq(articleSubmissions.id, articleId))
      .returning();

    if (updatedArticle.length > 0) {
      return NextResponse.json(
        { message: 'Article removed successfully' },
        { status: 201 }
      );
    }

    const results = [];

    for (const articleId of articleIds) {
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
      const updated = await db
        .update(articleSubmissions)
        .set({ isEditorsPick: true })
        .where(eq(articleSubmissions.id, articleId))
        .returning();

      if (updated.length > 0) {
        results.push(articleId);
      }
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
    console.error('Error creating issue:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
