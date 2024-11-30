import { auth } from "@/auth";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { articleSubmissions, db, files } from "@/db/schema";
import { ArticleSection } from "./ArticleSection";
import { SearchArticle } from "./SearchArticle";
import { eq, like, or } from "drizzle-orm";
export default async function DashboardPannel({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {
  console.log(searchParams)
  const articles = await db
    .select({
      id: articleSubmissions.id,
      commentsForEditor: articleSubmissions.commentsForEditor,
      fileURI: files.publicId,
      section: articleSubmissions.section
    })
    .from(articleSubmissions)
    .where(or(like(articleSubmissions.commentsForEditor, `%${searchParams.q || ''}%`)))
    .leftJoin(files, eq(articleSubmissions.id, files.articleId))
  const session = await auth();
  const currentUser = session?.user;

  return (
    <main className="container py-8 mx-auto">
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-1">
          <h2 className="text-2xl font-semibold">
            Welcome back, {currentUser?.name}
          </h2>
          <p className="text-muted-foreground">
            You&apos;ve got {articles.length} submitted articles.
          </p>
        </div>

        <SearchArticle />
        <Tabs defaultValue="queues" className="w-full">
          <TabsList className="w-full justify-start rounded-none border-b bg-transparent p-0">
            <TabsTrigger
              value="queues"
              className="rounded-none border-b-2 border-transparent px-4 py-2 font-medium data-[state=active]:border-primary"
            >
              My Queues
            </TabsTrigger>
            <TabsTrigger
              value="archives"
              className="rounded-none border-b-2 border-transparent px-4 py-2 font-medium data-[state=active]:border-primary"
            >
              Archives
            </TabsTrigger>
          </TabsList>
          <TabsContent value="queues" className="mt-6">
            <div className="grid gap-4">
              {articles.map((a, i) => (
                <ArticleSection article={a} key={i} index={i} />
              ))}
            </div>
          </TabsContent>
          <TabsContent value="archives" className="mt-6">
            <div className="text-center text-muted-foreground">
              No archived articles found.
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}

