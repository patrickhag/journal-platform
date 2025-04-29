import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db/db';
import { articleSubmissions } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { auth } from '@/auth';
import { notifyUser } from '@/lib/emailTransporter';

type Params = {
  id: string;
};

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<Params> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: 'Missing article ID' },
        { status: 400 }
      );
    }

    const article = await db.query.articleSubmissions.findFirst({
      where: eq(articleSubmissions.id, id),
      with: {
        user: {
          columns: {
            id: true,
          },
        },
      },
    });

    const session = await auth();

    if (!session || session?.user.id !== article?.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!article) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    }

    await db.delete(articleSubmissions).where(eq(articleSubmissions.id, id));

    return NextResponse.json(
      { message: 'Article deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting article:', error);
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
    const { id: articleId } = await params;
    const { publishedFile } = await req.json();
    const toBePublishedFile = publishedFile[0];

    const isPublished = await db
      .update(articleSubmissions)
      .set({
        publishedFile: toBePublishedFile,
        proofStatus: 'Finalized',
        articleStatus: 'PUBLISHED',
        doi: '10.5678/jaeph.2025.00101',
      })
      .where(eq(articleSubmissions.id, articleId))
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

    if (isPublished[0]) {
      return NextResponse.json({ message: 'Article published successfully!' });
    }
  } catch (error) {
    console.error('Error publishing issue:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
