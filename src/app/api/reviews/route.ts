import { NextRequest, NextResponse } from 'next/server';
import { db as dbWithQuery } from '@/db/db';
import {
  db,
  notifications,
  reviewAssignments,
  reviewAssessment,
  reviews,
} from '@/db/schema';
import { auth } from '@/auth';
import { articleSubmissions } from '@/db/schema';
import { and, desc, eq } from 'drizzle-orm';
import { notifyStaffEditorAboutReviewStatus } from '@/lib/emailTransporter';

export async function POST(req: Request) {
  try {
    const {
      message,
      articleId,
      fileIds,
      status,
      reviewAssignmentId,
      scopeRelevanceOriginality,
      ethicalCompliance,
      contentQualityRigor,
      dataPresentationInterpretation,
      conclusionsImplications,
      languageQuality,
      referencesFormatting,
      overallScientificQuality,
      confidentialComments,
      reviewerSignature,
    } = await req.json();

    const session = await auth();
    const userId = session?.user?.id || '';

    const hasReviewStatus = await dbWithQuery.query.reviews.findFirst({
      where: and(eq(reviews.userId, userId), eq(reviews.articleId, articleId)),
      columns: {
        id: true,
        status: true,
      },
    });

    // CHECK IF THE REVIEW HAS BEEN ALREADY SUBMITTED AND ACCEPTED OR REJECTED
    if (hasReviewStatus && hasReviewStatus.status === 'Accepted') {
      return NextResponse.json(
        { message: "You've already accepted this manuscript." },
        { status: 400 }
      );
    } else if (hasReviewStatus && hasReviewStatus.status === 'Rejected') {
      return NextResponse.json(
        { message: "You've already rejected this manuscript." },
        { status: 400 }
      );
    }

    // INSERT REVIEW AND REVIEW ASSESSMENT RECORDS
    await db.transaction(async (tx) => {
      const [reviewRecord] = await tx
        .insert(reviews)
        .values({
          message,
          articleId,
          fileIds,
          status,
          userId,
          reviewAssignmentId,
        })
        .returning({
          id: reviews.id,
        });

      if (!reviewRecord) {
        throw new Error('Unable to create review record.');
      }

      await tx.insert(reviewAssessment).values({
        reviewId: reviewRecord.id,
        scopeRelevanceOriginality,
        ethicalCompliance,
        contentQualityRigor,
        dataPresentationInterpretation,
        conclusionsImplications,
        languageQuality,
        referencesFormatting,
        overallScientificQuality,
        confidentialComments: confidentialComments || null,
        reviewerSignature,
      });

      return reviewRecord;
    });

    // UPDATE REVIEW ASSIGNMENT STATUS IF ACCEPTED
    if (status === 'Accepted') {
      await db
        .update(reviewAssignments)
        .set({
          status: 'FINALIZED',
        })
        .where(
          and(
            eq(reviewAssignments.userId, userId),
            eq(reviewAssignments.articleId, articleId)
          )
        );
    }

    const article = await dbWithQuery.query.articleSubmissions.findFirst({
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
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        editorAssignment: {
          with: {
            user: {
              columns: {
                id: true,
                email: true,
                prefix: true,
              },
            },
          },
        },
      },
      where: eq(articleSubmissions.id, articleId),
    });

    const articleTitle = article?.metadata.title;
    const authorName = article?.user.firstName + ' ' + article?.user.lastName;
    const staffEditorId = article?.editorAssignment.user.id;
    const staffEditorEmail = article?.editorAssignment.user.email;

    // SEND EMAIL TO STAFF-EDITOR ALSO
    await notifyStaffEditorAboutReviewStatus({
      articleTitle: articleTitle as string,
      authorNames: authorName,
      staffEditorEmail: staffEditorEmail as string,
      articleId: article?.id as string,
      status: status,
    });

    // SEND IN-APP NOTIFICATION TO THE STAFF-EDITOR
    await db.insert(notifications).values({
      message: `New review submitted for manuscript named "${articleTitle}"`,
      userId: staffEditorId,
      kind: 'Info',
    });

    return NextResponse.json(
      { message: 'Your review was sent successfully.' },
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

export async function GET(req: NextRequest) {
  try {
    const session = await auth();

    if (session?.user.role !== 'REVIEWER') {
      return NextResponse.json(
        {
          error:
            'Access denied: Only reviewers are permitted to access this resources.',
        },
        { status: 401 }
      );
    }

    const reviewerAssignedArticles =
      await dbWithQuery.query.reviewAssignments.findMany({
        columns: {
          id: true,
          assignedDate: true,
          dueDate: true,
          status: true,
        },
        where: and(
          eq(reviewAssignments.userId, session.user.id as string),
          eq(reviewAssignments.status, 'ACCEPTED')
        ),
        orderBy: desc(reviewAssignments.assignedDate),
        with: {
          article: {
            columns: {
              id: true,
              articleStatus: true,
            },
            with: {
              metadata: {
                columns: {
                  title: true,
                  prefix: true,
                },
              },
              user: {
                columns: {
                  firstName: true,
                  lastName: true,
                },
              },
            },
          },
        },
      });

    const assignedArticles = reviewerAssignedArticles.filter(
      (assignedArticle) => {
        return assignedArticle?.article?.articleStatus === 'UNDER REVIEW';
      }
    );

    const dueArticles = assignedArticles.filter((article) => {
      const dueDate = new Date(article.dueDate as string);
      const currentDate = new Date();
      return (
        currentDate > dueDate &&
        article?.article?.articleStatus === 'UNDER REVIEW'
      );
    });

    return NextResponse.json({ assignedArticles, dueArticles });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();

    if (!body.assignmentId) {
      return NextResponse.json(
        { message: 'Inviation not found!' },
        { status: 400 }
      );
    }

    const isAccepted = await db
      .update(reviewAssignments)
      .set({
        status: 'ACCEPTED',
      })
      .where(eq(reviewAssignments.id, body.assignmentId))
      .returning();

    if (isAccepted.length > 0) {
      return NextResponse.json(
        { message: 'Thank you for accepting the invitation!' },
        { status: 200 }
      );
    }
  } catch (error) {
    console.error('[REVIEWS_POST]', error);
    return NextResponse.json(
      { error: 'Something went wrong', details: error },
      { status: 400 }
    );
  }
}
