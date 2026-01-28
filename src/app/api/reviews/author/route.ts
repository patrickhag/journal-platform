import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db/db';
import { authorRevisions, reviews, reviewAssignments } from '@/db/schema';
import { auth } from '@/auth';
import { articleSubmissions } from '@/db/schema';
import { and, desc, eq } from 'drizzle-orm';
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
    const authorId = session?.user?.id;

    // INSERT AUTHOR REVISION AND GET THE ID
    const [insertedAuthorRevision] = await db
      .insert(authorRevisions)
      .values({
        articleId,
        authorId,
        message,
        fileIds,
      })
      .returning({ id: authorRevisions.id });

    const authorRevisionId = insertedAuthorRevision.id;

    // FETCH ARTICLE WITH REVIEWS AND EDITOR INFO
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

    // CREATE REVIEW REVISIONS FOR EACH SUBMITTED REVIEW AND LINK TO AUTHOR REVISION
    const articleReviewAssignments = article?.reviewAssignments || [];

    for (const reviewAssignment of articleReviewAssignments) {
      // SEND EMAIL NOTIFICATION TO THE REVIEWER
      const reviewerName =
        `${reviewAssignment?.user?.prefix || ''} ${reviewAssignment?.user?.firstName} ${reviewAssignment?.user?.lastName}`.trim();

      // ADD AUTHOR REVISION-ID TO REVIEW ASSIGNMENTS
      await db
        .update(reviewAssignments)
        .set({
          authorRevisionId,
        })
        .where(eq(reviewAssignments.id, reviewAssignment.id));
    }

    // SEND EMAIL TO STAFF-EDITOR ABOUT THE AUTHOR REPLY
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
