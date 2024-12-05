import { auth } from "@/auth";
import Files from "@/components/articles/Files";
import Metadata from "@/components/articles/Metadata";
import Reviewer from "@/components/articles/Reviewer";
import { articleSubmissions, db, reviewers, users, } from "@/db/schema";
import { eq } from "drizzle-orm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

async function page({
  params,
}: {
  params: Promise<{ articleId: string[] }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const parameters = await params
  const [articleId] = parameters.articleId

  const articles = await db
    .select()
    .from(articleSubmissions)
    .where(eq(articleSubmissions.id, articleId,))
    .limit(1)

  if (articles.length <= 0) return <h1>Article Not Found</h1>
  const article = articles[0]
  const session = await auth();
  const currentUser = session?.user
  if (!currentUser) return <h1>Not authenticated</h1>

  const currentUserRole = (await db.select({ role: users.role }).from(users).limit(1))[0].role
  const author = await db
    .select()
    .from(users)
    .where(eq(users.id, articles[0].userId,))
    .limit(1)

  const reviewrs = await db
    .select()
    .from(reviewers)
    .where(eq(reviewers.articleId, articleId,))


  return (
    <div className="container mx-auto p-6 grid grid-cols-1 lg:grid-cols-[1fr,400px] gap-8">

      <main className="space-y-8">
        <Metadata articleId={articleId} role={currentUserRole!}>
          <div className="space-y-4 text-gray-600" dangerouslySetInnerHTML={{ __html: article.commentsForEditor }} />
        </Metadata>
      </main>

      <aside className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Author information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Fullnames</h3>
                <p className="mt-1">{author[0].firstName} {author[0].lastName}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Email</h3>
                <p className="mt-1">{author[0].email}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Affiliation</h3>
                <p className="mt-1">{author[0].affiliation}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Country</h3>
                <p className="mt-1">{author[0].country}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Files articleId={articleId}
        />

        <Card>
          <CardHeader>
            <CardTitle>Reviewers</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {reviewrs.map((r, index) => <Reviewer reviewer={r} index={index} key={r.id} />)}
          </CardContent>
        </Card>
      </aside>
    </div>
  )
}

export default page
