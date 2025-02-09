import { auth } from '@/auth';
import { db } from '@/db/db';
import { reviewers, users } from '@/db/schema';
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

  const toEmail = (
    await db
      .select()
      .from(reviewers)
      .where(eq(reviewers.articleId, articleId))
      .limit(1)
  )[0]?.email;

  if (isAcceptingInvite && userId) {
    await db
      .update(reviewers)
      .set({ acceptedInvitation: Boolean(parseInt(isAcceptingInvite)) })
      .where(eq(reviewers.articleId, articleId));

    await db
      .update(users)
      .set({ role: 'REVIEWER' })
      .where(eq(users.email, toEmail));
  }

  redirect(`/articles/${articleId}`);

  return <p>Redirecting...</p>;
}
