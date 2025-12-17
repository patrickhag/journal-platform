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
import { ReviewerInvitationToast } from './components/InvitationToast';

type PageProps = {
  params: Promise<{
    articleId: string;
  }>;
  searchParams: Promise<{
    [key: string]: string | string[] | undefined;
  }>;
};

export default async function InvitationPage({
  params,
  searchParams,
}: PageProps) {
  const { articleId } = await params;

  const userId = (await auth())?.user?.id;
  const search = await searchParams;
  const reviewAssignmentId = search.reviewAssignmentId as string;
  const inviteStatus = search.inviteStatus as string | undefined;

  console.log('inviteStatus:', inviteStatus);
  console.log('reviewAssignmentId:', reviewAssignmentId);

  // If no reviewAssignmentId or inviteStatus, redirect
  if (!reviewAssignmentId || inviteStatus === undefined) {
    redirect(`/reviewer/assignments`);
  }

  // Fetch the review assignment to check current status
  const reviewAssignment = await db.query.reviewAssignments.findFirst({
    where: eq(reviewAssignments.id, reviewAssignmentId),
    with: {
      user: {
        columns: {
          firstName: true,
          lastName: true,
        },
      },
    },
  });

  if (!reviewAssignment) {
    redirect(`/reviewer/assignments`);
  }

  // Check if invitation has already been responded to
  if (reviewAssignment.status === 'ACCEPTED') {
    return (
      <>
        <ReviewerInvitationToast
          status="already-accepted"
          redirectTo="/reviewer/assignments"
        />
        <p>Redirecting...</p>
      </>
    );
  }

  if (reviewAssignment.status === 'DECLINED') {
    return (
      <>
        <ReviewerInvitationToast
          status="already-declined"
          redirectTo="/reviewer/assignments"
        />
        <p>Redirecting...</p>
      </>
    );
  }

  // Get article and editor information
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

  if (!associateEditorInfo) {
    redirect(`/reviewer/assignments`);
  }

  const associateEditorName =
    associateEditorInfo?.editorAssignment?.user.firstName +
    ' ' +
    associateEditorInfo?.editorAssignment?.user.lastName;

  const associateEditorId = associateEditorInfo?.editorAssignment?.user.id;

  const reviewerNames =
    reviewAssignment?.user?.firstName + ' ' + reviewAssignment?.user?.lastName;
  const articleTitle = associateEditorInfo?.metadata.title;

  const isAccepting = inviteStatus === '1';

  if (isAccepting) {
    // REVIEWER ACCEPTED INVITATION
    await db
      .update(reviewAssignments)
      .set({ status: 'ACCEPTED', userId: userId })
      .where(eq(reviewAssignments.id, reviewAssignmentId));

    // INFORM STAFF-EDITOR ABOUT THE INVITATION
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

    return (
      <>
        <ReviewerInvitationToast
          status="accepted"
          redirectTo="/reviewer/assignments"
        />
        <p>Redirecting...</p>
      </>
    );
  } else {
    // REVIEWER DECLINED INVITATION
    await db
      .update(reviewAssignments)
      .set({ status: 'DECLINED' })
      .where(eq(reviewAssignments.id, reviewAssignmentId));

    // INFORM STAFF-EDITOR ABOUT THE DECLINED INVITATION
    await informStaffEditorAboutReviewerInvitation({
      staffEditorName: associateEditorName,
      associateEditorEmail: associateEditorInfo?.editorAssignment?.user
        .email as string,
      reviewerName: reviewerNames as string,
      articleTitle: articleTitle as string,
      status: 'rejected',
    });

    await db.insert(notifications).values({
      message: `Reviwer ${reviewerNames} has declined the invitation of reviewing the manuscript.`,
      userId: associateEditorId,
    });

    return (
      <>
        <ReviewerInvitationToast
          status="declined"
          redirectTo="/reviewer/assignments"
        />
        <p>Redirecting...</p>
      </>
    );
  }
}
