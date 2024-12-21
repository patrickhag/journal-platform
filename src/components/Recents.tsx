import { articles as articleSubmissions, articleContributors as contributors, db, articleMetadata as metadata, people } from '@/db/schema';
import { eq } from 'drizzle-orm';

export const Recents = async () => {
  const articles = await db
    .select(
      {
        id: articleSubmissions.id,
        createdAt: articleSubmissions.createdAt,
        title: metadata.title,
      }
    )
    .from(articleSubmissions)
    .leftJoin(metadata, eq(articleSubmissions.id, metadata.articleId)).limit(10);

  return (
    <div>
      <h2 className="text-xl font-bold mb-4" style={{ color: '#1A237E' }}>
        Recently Published
      </h2>
      {articles.map(a => {
        return <div key={a.id} className="space-y-6 w-[90%]">
          <div className="border-b pb-4">
            <h3 className="font-semibold text-lg text-gray-800">
              {a.title}
            </h3>
            <ContributorList articleId={a.id} />
            <p className="text-sm text-gray-500">{a.createdAt}</p>
          </div>
        </div>
      })}
    </div>
  )
}
const ContributorList = async ({ articleId }: { articleId: string }) => {
  const contributorList = await db.select({
    name: people.name,
    id: contributors.id
  }).from(contributors).leftJoin(people, eq(contributors.personId, people.id)).where(eq(contributors.articleId, articleId))
  return <p className="text-sm text-gray-600">
    {contributorList.map(c => <span key={c.id}>{c.name}</span>)}
  </p>
}
