import { auth } from "@/auth";
import Contributor from "@/components/articles/Contributor";
import Files from "@/components/articles/Files";
import Metadata from "@/components/articles/Metadata";
import Reviewer from "@/components/articles/Reviewer";
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { articleSubmissions, db, users, } from "@/db/schema";
import { eq } from "drizzle-orm";
// import withPermissions from '@/lib/roles'
import Reviews from "@/components/articles/Reviews";
import withPermissions from "@/components/WithPermission";
async function page({
  params,
  searchParams
}: {
  params: Promise<{ articleId: string[] }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const parameters = await params
  const sparams = await searchParams
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
  return (
    <div className="container mx-auto p-6 grid grid-cols-1 lg:grid-cols-[1fr,400px] gap-8">
      {/* Main Content */}
      <main className="space-y-8">
        <Metadata articleId={articleId} role={currentUserRole!} />
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-blue-900">Editor commentary</h2>
          <div className="space-y-4 text-gray-600" dangerouslySetInnerHTML={{ __html: article.commentsForEditor }}>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600">{article.createdAt}</span>
            <UpdateCommentaryWithPermissions requiredPermissions={['UPDATE_JOURNAL']} role={currentUserRole!} fallback={<></>}/>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-blue-900">References</h2>
          <p className="text-gray-600">
            Lorem ipsum dolor sit amet Lorem ipsum dolor sit amet Lorem ipsum
            Lorem ipsum dolor sit amet Lorem ipsum dolor sit amet Lorem ipsum
            Lorem ipsum dolor sit amet Lorem ipsum dolor sit amet Lorem ipsum
          </p>
        </section>
      </main>

      <aside className="space-y-8">
        {sparams.reviewer &&
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-blue-900">Reviwer information</h2>
            <Reviewer reviewer={sparams.reviewer as string} />
          </section>
        }
        {sparams.contributor &&
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-blue-900">Contributor information</h2>
            <Contributor contributor={sparams.contributor as string} role={currentUserRole!} />
          </section>
        }

        <section className="bg-gray-100 p-6 rounded-lg">
          <h2 className="text-2xl font-bold text-blue-900 mb-4">Files</h2>
          <ScrollArea className="h-[200px]">
            <div className="space-y-3">
              <Files articleId={articleId} role={currentUserRole!} />
            </div>
          </ScrollArea>
        </section>

        {/* Reviews Section */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-blue-900">Reviews</h2>
          <ScrollArea className="h-[300px]">
            <Reviews role={currentUserRole!}/>
          </ScrollArea>
        </section>
      </aside>
    </div>
  )
}

export default page

const UpdateCommentary = () => <Button variant="outline" className="bg-blue-500 text-white hover:bg-blue-600">
  Update
</Button>

const UpdateCommentaryWithPermissions = withPermissions(UpdateCommentary)