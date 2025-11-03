import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db/db';
import { authorRevisions, reviews } from '@/db/schema';
import { auth } from '@/auth';
import { articleSubmissions } from '@/db/schema';
import { and, desc, eq } from 'drizzle-orm';
import { authorInformStaffEditor } from '@/lib/emailTransporter';

export async function GET(req: NextRequest) {
  try {
    const session = await auth();

    const userId = session?.user.id;

    const reviewersReviews = await db.query.articleSubmissions.findMany({
      where: and(
        eq(articleSubmissions.userId, userId as string),
        eq(articleSubmissions.articleStatus, 'CORRECTION')
      ),
      columns: {
        id: true,
        articleStatus: true,
      },
      with: {
        metadata: {
          columns: {
            title: true,
          },
        },
        reviews: {
          orderBy: desc(reviews.reviewedAt),
          columns: {
            id: true,
            articleId: true,
            reviewedAt: true,
            status: true,
            message: true,
            fileIds: true,
          },
          with: {
            user: {
              columns: {
                id: true,
                firstName: true,
                lastName: true,
                prefix: true,
                email: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json(reviewersReviews);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const { articleId, message, fileIds } = await req.json();

    const session = await auth();
    const authorName = session?.user?.name;

    const insertInfo = {
      articleId,
      authorId: session?.user?.id,
      message,
      fileIds,
    };

    await db.insert(authorRevisions).values(insertInfo);

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
        editorAssignment: {
          with: {
            user: {
              columns: {
                email: true,
                firstName: true,
                lastName: true,
              },
            },
          },
        },
      },
      where: eq(articleSubmissions.id, articleId),
    });

    const staffEditorEmail = article?.editorAssignment.user.email;
    const staffEditorName =
      article?.editorAssignment.user.firstName +
      ' ' +
      article?.editorAssignment.user.lastName;

    // send email to staff-editor about the author reply
    await authorInformStaffEditor({
      staffEditorName: staffEditorName as string,
      articleTitle: article?.metadata.title as string,
      articleLink: articleId,
      authorName: authorName as string,
      message,
      staffEditorEmail: staffEditorEmail as string,
    });

    return NextResponse.json(
      { message: 'Reply sent successfully and staff-editor informed' },
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
