import { NextResponse } from 'next/server';
import { db } from '@/db/db';
import { reviews } from '@/db/schema';
import { auth } from '@/auth';

import { articleSubmissions, notifications, users } from '@/db/schema';

import { eq } from 'drizzle-orm';
import { notifyAdmin, notifyUserAboutReview } from '@/lib/emailTransporter';

// export async function GET(request: Request) {
//     try {
//         const { searchParams } = new URL(request.url);
//         const articleId = searchParams.get('articleId');

//         if (!articleId) {
//             return NextResponse.json(
//                 { error: 'Article ID is required' },
//                 { status: 400 }
//             );
//         }

//         const reviews = await db.query.reviews.findMany({
//             where: {
//                 articleId: articleId,
//             },
//             include: {
//                 user: {
//                     select: {
//                         name: true,
//                         email: true,
//                     },
//                 },
//             },
//             orderBy: {
//                 createdAt: 'desc',
//             },
//         });

//         return NextResponse.json(reviews);
//     } catch (error) {
//         console.error('Error fetching reviews:', error);
//         return NextResponse.json(
//             { error: 'Internal Server Error' },
//             { status: 500 }
//         );
//     }
// }

// your reviews schema

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
    const authorName = `${article?.user.firstName as string} ${article?.user.lastName as string}`;
    const authorEmail = article?.user.email as string;
    const articleLink = article?.id as string;

    // send email to admin
    await notifyAdmin({
      article: articleTitle as string,
      authorName: session?.user?.name as string,
      subject: 'New Review Submitted',
      participant: 'REVIEWER',
      articleId: article?.id as string,
    });

    // send email to author
    await notifyUserAboutReview({
      article: articleTitle as string,
      authorName: authorName,
      authorEmail: authorEmail,
      articleLink: articleLink,
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
