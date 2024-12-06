import { auth } from '@/auth';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { articleSubmissions, files } from '@/db/schema';
import { db } from '@/db/schema';
import { ArticleSection } from './ArticleSection';
import { SearchArticle } from './SearchArticle';
import { and, eq, like } from 'drizzle-orm';
import { PlusCircle } from 'lucide-react';
import { Button } from './ui/button';
import Link from 'next/link';
import { TArticle } from '@/schemas/reviewer';

export default async function DashboardPannel({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const session = await auth();
  const currentUser = session?.user;

  const where = () => {
    const conditions = [];
    if (searchParams.q) {
      conditions.push(
        like(articleSubmissions.commentsForEditor, `%${searchParams.q}%`)
      );
    }
    if (currentUser?.id) {
      conditions.push(eq(articleSubmissions.userId, currentUser.id));
    }
    return conditions.length > 0 ? and(...conditions) : undefined;
  };

  const articles = (await db
    .select({
      id: articleSubmissions.id,
      commentsForEditor: articleSubmissions.commentsForEditor,
      fileURI: files.publicId,
      section: articleSubmissions.section,
      articleStatus: articleSubmissions.articleStatus,
    })
    .from(articleSubmissions)
    .where(where())
    .leftJoin(files, eq(articleSubmissions.id, files.articleId))) as TArticle[];

  return (
    <main className="max-w-7xl py-8 mx-auto">
      <div>
        <div className="mb-10">
          <h2 className="text-2xl text-[#141A26] font-medium">
            Welcome back, {currentUser?.name}
          </h2>
          <p className="text-muted-foreground">
            You&apos;ve got {articles.length} submitted articles.
          </p>
        </div>

        <Tabs defaultValue="articles">
          <div className="flex justify-between">
            <TabsList className="w-full justify-start rounded-none border-b bg-transparent p-0">
              <TabsTrigger
                value="articles"
                className="rounded-md border-b-2 border-transparent px-4 py-2 font-medium data-[state=active]:border-primary"
              >
                My articles
              </TabsTrigger>
              <TabsTrigger
                value="archives"
                className="rounded-md border-b-2 border-transparent px-4 py-2 font-medium data-[state=active]:border-primary"
              >
                Archives
              </TabsTrigger>
            </TabsList>
            <SearchArticle />
            <Button className="mx-5 bg-[#141A26]">
              <Link href="/articles/new/start">
                <span className="flex items-center gap-2">
                  <PlusCircle className="w-4 h-4" />
                  New article
                </span>
              </Link>
            </Button>
          </div>
          <TabsContent value="articles" className="mt-6">
            <div className="grid gap-4">
              {articles.length > 0 ? (
                articles.map((a, i) => (
                  <ArticleSection article={a} key={i} index={i} />
                ))
              ) : (
                <div className="text-center text-muted-foreground">
                  You haven&apos;t submitted any articles yet. Click &quot;New
                  article&quot; to get started.
                </div>
              )}
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
