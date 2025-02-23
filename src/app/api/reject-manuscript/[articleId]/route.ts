import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { db } from '@/db/db';
import { articleSubmissions } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { rejectManuscriptEmail } from '@/lib/emailTransporter';

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ articleId: string }> }
) {
  try {
    const { articleId } = await params;
    const article = await db.query.articleSubmissions.findFirst({
      columns: {
        id: true,
      },
      with: {
        user: {
          columns: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        metadata: {
          columns: {
            title: true,
          },
        },
      },
      where: eq(articleSubmissions.id, articleId),
    });

    if (!article) {
      return NextResponse.json({
        status: 404,
        message: 'Article not found',
      });
    }

    const updatedArticle = await db
      .update(articleSubmissions)
      .set({ articleStatus: 'Rejected' })
      .where(eq(articleSubmissions.id, articleId))
      .returning();

    if (updatedArticle[0]) {
      await rejectManuscriptEmail({
        article: article.metadata.title,
        authorEmail: article.user.email!,
        names: `${article.user.firstName} ${article.user.lastName}`,
      });
    }

    revalidatePath('/articles/' + articleId);

    return NextResponse.json({
      status: 200,
      message: 'Manuscript rejected',
      article,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({
      status: 500,
      message: 'Error rejecting manuscript',
    });
  }
}
