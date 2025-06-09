import { auth } from '@/auth';
import { db } from '@/db/db';
import {
  articleSubmissions,
  notifications,
  reviewAssignments,
  reviewers,
  users,
} from '@/db/schema';
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
  const isAcceptingInvite = search.accept_invite?.toString();
  const editorInChiefId = search.editor?.toString();

  const toEmail = (
    await db
      .select()
      .from(reviewers)
      .where(eq(reviewers.articleId, articleId))
      .limit(1)
  )[0]?.email;

  const reviewer = await db.query.reviewers.findFirst({
    columns: {
      names: true,
    },
    where: eq(reviewers.articleId, articleId),
  });

  if (isAcceptingInvite && userId) {
    await db
      .update(reviewAssignments)
      .set({ status: 'ACCEPTED', userId: userId })
      .where(eq(reviewAssignments.articleId, articleId));

    await db
      .update(users)
      .set({ role: 'REVIEWER' })
      .where(eq(users.email, toEmail));

    await db
      .update(articleSubmissions)
      .set({
        articleStatus: 'UNDER REVIEW',
        updatedAt: new Date().toISOString(),
      })
      .where(eq(articleSubmissions.id, articleId));

    await db.insert(notifications).values({
      message: `Reviewer ${reviewer?.names} has accepted an invitation of reviewing the manuscript.`,
      userId: editorInChiefId,
    });
  }

  redirect(`/articles/${articleId}`);

  return <p>Redirecting...</p>;
}
