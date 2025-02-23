import { auth } from '@/auth';
import { db } from '@/db/db';
import {
  articleSubmissions,
  notifications,
  reviewers,
  users,
} from '@/db/schema';
import { eq } from 'drizzle-orm';
import { redirect } from 'next/navigation';

export default async function AcceptPage({
  params,
  searchParams,
}: {
  params: { articleId: string[] };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const articleId = params.articleId[0];

  const userId = (await auth())?.user?.id;
  const isAcceptingInvite = searchParams.accept_invite?.toString();
  const editorInChiefId = searchParams.editor?.toString();

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
      .update(reviewers)
      .set({ acceptedInvitation: Boolean(parseInt(isAcceptingInvite)) })
      .where(eq(reviewers.articleId, articleId));

    await db
      .update(users)
      .set({ role: 'REVIEWER' })
      .where(eq(users.email, toEmail));

    await db
      .update(articleSubmissions)
      .set({
        articleStatus: 'Under Review',
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
