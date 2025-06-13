import { db } from '@/db/db';
import { ReviewsCardView } from './components/ReviewsCardView';
import { and, eq } from 'drizzle-orm';
import { articleSubmissions, metadata, reviewAssignments } from '@/db/schema';
import { auth } from '@/auth';

export default async function Dashboard() {
  const session = await auth();

  const userId = session?.user.id;

  const assignedArticles = await db
    .select({
      id: articleSubmissions.id,
      section: articleSubmissions.section,
      articleStatus: articleSubmissions.articleStatus,
      title: metadata.title,
    })
    .from(articleSubmissions)
    .leftJoin(metadata, eq(articleSubmissions.id, metadata.articleId))
    .leftJoin(
      reviewAssignments,
      eq(articleSubmissions.id, reviewAssignments.articleId)
    )
    .where(
      and(
        eq(reviewAssignments.userId, userId as string),
        eq(reviewAssignments.status, 'ACCEPTED')
      )
    );

  return (
    <div>
      <div className="mb-10">
        <h1 className="text-2xl text-[#141A26] font-bold">
          Welcome back, {session?.user.name}
        </h1>
        <p className="text-muted-foreground mt-1">
          You&apos;ve got {assignedArticles.length} manuscripts assigned to you.
        </p>
      </div>

      <div className="mt-6">
        <ReviewsCardView data={assignedArticles ?? []} />
      </div>
    </div>
  );
}
