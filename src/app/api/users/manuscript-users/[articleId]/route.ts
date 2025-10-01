import { auth } from '@/auth';
import { db } from '@/db/db';
import { articleSubmissions, publishedArticles, users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
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

    const { fileId, articleId } = await req.json();

    // check if fileId is already in published_articles
    const existingFile = await db.query.publishedArticles.findFirst({
      where: eq(publishedArticles.articleId, articleId),
    });
    if (existingFile) {
      return NextResponse.json(
        { error: 'File already transferred' },
        { status: 400 }
      );
    }

    // update manuscript status
    await db
      .update(articleSubmissions)
      .set({ acceptedAt: new Date().toISOString(), articleStatus: 'ACCEPTED' })
      .where(eq(articleSubmissions.id, articleId));

    // add fileId to published_articles
    await db.insert(publishedArticles).values({
      articleId,
      pdfUrl: fileId,
    });

    return NextResponse.json(
      { message: 'File transferred to published preparation!' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error adding file to published articles:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
