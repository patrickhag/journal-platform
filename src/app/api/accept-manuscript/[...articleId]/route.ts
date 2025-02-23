import { db } from '@/db/db';
import { articleSubmissions, notifications } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';
import { acceptManuscriptEmail } from '@/lib/emailTransporter';
import { revalidatePath } from 'next/cache';

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ articleId: [string] }> }
) {
  try {
    const parameters = await params;
    const [articleId] = parameters.articleId;

    const article = await db.query.articleSubmissions.findFirst({
      columns: {
        id: true,
      },
      with: {
        user: {
          columns: {
            id: true,
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
      .set({ articleStatus: 'Accepted' })
      .where(eq(articleSubmissions.id, articleId))
      .returning();

    if (updatedArticle[0]) {
      await acceptManuscriptEmail({
        nameOfArticle: article.metadata.title,
        authorEmail: article.user.email!,
        names: `${article.user.firstName} ${article.user.lastName}`,
      });
    }

    await db.insert(notifications).values({
      message: `Your manuscript has been accepted for the second stage.`,
      userId: article.user.id!,
    });

    revalidatePath('/articles/' + articleId);

    return NextResponse.json({
      status: 200,
      message: 'Manuscript Accepted',
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({
      status: 500,
      message: 'Error accepting manuscript',
    });
  }
}
