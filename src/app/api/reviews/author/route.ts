import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db/db';
import { authorRevisions, reviews, reviewAssignments } from '@/db/schema';
import { auth } from '@/auth';
import { articleSubmissions } from '@/db/schema';
import { and, desc, eq, isNotNull } from 'drizzle-orm';
import {
  authorInformStaffEditor,
  authorInformReviewer,
} from '@/lib/emailTransporter';

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

    // Insert author revision and get the ID
    const [insertedAuthorRevision] = await db
      .insert(authorRevisions)
      .values({
        articleId,
        authorId: '0004a9ae-add6-4bc8-bde9-4b783ef027ec',
        message,
        fileIds,
      })
      .returning({ id: authorRevisions.id });

    const authorRevisionId = insertedAuthorRevision.id;

    // update article status to UNDER REVIEW
    await db
      .update(articleSubmissions)
      .set({
        articleStatus: 'UNDER REVIEW',
      })
      .where(eq(articleSubmissions.id, articleId));

    // fetch article with reviews and editor info
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
        reviewAssignments: {
          where: eq(reviewAssignments.status, 'ACCEPTED'),
          columns: {
            id: true,
          },
          with: {
            user: {
              columns: {
                email: true,
                firstName: true,
                lastName: true,
                prefix: true,
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

    // create review revisions for each submitted review and link to author revision
    const articleReviewAssignments = article?.reviewAssignments || [];

    for (const reviewAssignment of articleReviewAssignments) {
      // send email notification to the reviewer
      const reviewerName =
        `${reviewAssignment?.user?.prefix || ''} ${reviewAssignment?.user?.firstName} ${reviewAssignment?.user?.lastName}`.trim();

      // add author revision-id to review assignments
      await db
        .update(reviewAssignments)
        .set({
          authorRevisionId,
        })
        .where(eq(reviewAssignments.id, reviewAssignment.id));

      await authorInformReviewer({
        reviewerName,
        authorName: authorName as string,
        articleTitle: article?.metadata.title as string,
        articleLink: articleId,
        message,
        reviewerEmail: reviewAssignment?.user?.email as string,
      });
    }

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
      {
        message:
          'Reply sent successfully. Staff editor and reviewers have been notified.',
      },
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
