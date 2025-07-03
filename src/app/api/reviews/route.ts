import { NextResponse } from 'next/server';
import { db } from '@/db/db';
import { reviews } from '@/db/schema';
import { auth } from '@/auth';
import { articleSubmissions, notifications, users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { notifyAdmin } from '@/lib/emailTransporter';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const session = await auth();
    const userId = session?.user?.id || '';

    await db.insert(reviews).values({
      message: body.message,
      articleId: body.articleId,
      fileIds: body.fileIds,
      status: body.status,
      userId,
    });

    if (body.status === 'ACCEPTED') {
      await db
        .update(articleSubmissions)
        .set({ proofStatus: 'AwaitingProof', articleStatus: 'ACCEPTED' })
        .where(eq(articleSubmissions.id, body.articleId));
    }

    const chiefEditorEMail = await db
      .select({ id: users.id, email: users.email })
      .from(users)
      .where(eq(users.role, 'CHIEF_EDITOR'));

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
      where: eq(articleSubmissions.id, body.articleId),
    });

    const articleTitle = article?.metadata.title;

    // send email to admin
    await notifyAdmin({
      article: articleTitle as string,
      authorName: session?.user?.name as string,
      subject: 'New Review Submitted',
      participant: 'REVIEWER',
      articleId: article?.id as string,
    });

    // send in-app notification for admin
    await db.insert(notifications).values({
      message: `New review submitted for article named "${articleTitle}"`,
      userId: chiefEditorEMail[0].id as string,
      kind: 'Info',
    });

    return NextResponse.json(
      { message: 'Review created successfully' },
      { status: 201 }
    );
  } catch (error) {
    console.error('[REVIEWS_POST]', error);
    return NextResponse.json(
      { error: 'Something went wrong', details: error },
      { status: 400 }
    );
  }
}
