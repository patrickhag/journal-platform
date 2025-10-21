import { auth } from '@/auth';
import { db } from '@/db/db';
import {
  articleSubmissions,
  notifications,
  reviewAssignments,
} from '@/db/schema';
import { informStaffEditorAboutReviewerInvitation } from '@/lib/emailTransporter';
import { eq } from 'drizzle-orm';
import { redirect } from 'next/navigation';

type PageProps = {
  params: Promise<{
    articleId: string;
  }>;
};

export default async function InvitationPage({ params }: PageProps) {
  const { articleId } = await params;

  const userId = (await auth())?.user?.id;

  const reviewer = await db.query.reviewAssignments.findFirst({
    where: eq(reviewAssignments.userId, userId as string),
    with: {
      user: {
        columns: {
          firstName: true,
          lastName: true,
        },
      },
    },
  });

  const associateEditorInfo = await db.query.articleSubmissions.findFirst({
    where: eq(articleSubmissions.id, articleId),
    with: {
      editorAssignment: {
        with: {
          user: {
            columns: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
        },
      },
      metadata: {
        columns: {
          title: true,
        },
      },
    },
  });

  const associateEditorName =
    associateEditorInfo?.editorAssignment?.user.firstName +
    ' ' +
    associateEditorInfo?.editorAssignment?.user.lastName;

  const associateEditorId = associateEditorInfo?.editorAssignment?.user.id;

  const reviewerNames =
    reviewer?.user?.firstName + ' ' + reviewer?.user?.lastName;
  const articleTitle = associateEditorInfo?.metadata.title;

  // REVIEWER ACCEPTED INVITATION
  await db
    .update(reviewAssignments)
    .set({ status: 'ACCEPTED', userId: userId })
    .where(eq(reviewAssignments.articleId, articleId));

  await db
    .update(articleSubmissions)
    .set({
      articleStatus: 'UNDER REVIEW',
    })
    .where(eq(articleSubmissions.id, articleId));

  await informStaffEditorAboutReviewerInvitation({
    staffEditorName: associateEditorName,
    associateEditorEmail: associateEditorInfo?.editorAssignment?.user
      .email as string,
    reviewerName: reviewerNames as string,
    articleTitle: articleTitle as string,
    status: 'accepted',
  });

  await db.insert(notifications).values({
    message: `Reviwer ${reviewerNames} has accepted the invitation of reviewing the manuscript.`,
    userId: associateEditorId,
  });

  redirect(`/reviewer/assignments`);
}
