import { auth } from '@/auth';
import { db } from '@/db/db';
import {
  articleSubmissions,
  notifications,
  reviewAssignments,
  reviewers,
} from '@/db/schema';
import { informAssociateEditor } from '@/lib/emailTransporter';
import { eq } from 'drizzle-orm';
import { redirect } from 'next/navigation';

type PageProps = {
  params: Promise<{
    articleId: string;
  }>;
  searchParams: Promise<{
    [key: string]: string | string[] | undefined;
  }>;
};

export default async function AcceptPage({ params, searchParams }: PageProps) {
  const { articleId } = await params;

  const userId = (await auth())?.user?.id;
  const search = await searchParams;
  const invitationSign = search.accept_invite;
  const isAcceptedOrDeclined = !!invitationSign;

  const reviewer = await db.query.reviewers.findFirst({
    columns: {
      names: true,
    },
    where: eq(reviewers.articleId, articleId),
  });

  const associateEditorInfo = await db.query.articleSubmissions.findFirst({
    where: eq(articleSubmissions.id, articleId),
    with: {
      editor: {
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
    associateEditorInfo?.editor?.user.firstName +
    ' ' +
    associateEditorInfo?.editor?.user.lastName;
  const associateEditorId = associateEditorInfo?.editor?.user.id;
  const reviewerNames = reviewer?.names;
  const articleTitle = associateEditorInfo?.metadata.title;

  if (isAcceptedOrDeclined && userId) {
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

    await informAssociateEditor({
      associateEditorName: associateEditorName,
      associateEditorEmail: associateEditorInfo?.editor?.user.email as string,
      reviewerName: reviewerNames as string,
      articleTitle: articleTitle as string,
      status: 'accepted',
    });

    await db.insert(notifications).values({
      message: `Reviwer ${reviewerNames} has accepted the invitation of reviewing the manuscript.`,
      userId: associateEditorId,
    });

    redirect(`/articles/${articleId}`);
  } else if (isAcceptedOrDeclined === false) {
    await informAssociateEditor({
      associateEditorName: associateEditorName,
      associateEditorEmail: associateEditorInfo?.editor?.user.email as string,
      reviewerName: reviewerNames as string,
      articleTitle: articleTitle as string,
      status: 'rejected',
    });

    await db.insert(notifications).values({
      message: `Reviwer ${reviewerNames} has declined the invitation of reviewing the manuscript.`,
      userId: associateEditorId,
    });
  }

  return <p>Redirecting...</p>;
}
