import { auth } from '@/auth';
import { Tabs, TabsContent, TabsList } from '@/components/ui/tabs';
import { articleSubmissions, files, metadata, reviewers } from '@/db/schema';
import { db } from '@/db/schema';
import { ArticleSection } from './ArticleSection';
import { SearchArticle } from './SearchArticle';
import { and, eq, like, inArray } from 'drizzle-orm';
import { PlusCircle } from 'lucide-react';
import { Button } from './ui/button';
import Link from 'next/link';
import { ArticleFilters } from './ArticleFilters';
import { ARTICLE_STATUS, articleFilters } from '@/lib/consts';

export default async function DashboardPannel({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const session = await auth();
  const currentUser = session?.user;

  const where = async () => {
    const conditions = [];

    if (searchParams.q) {
      conditions.push(
        like(articleSubmissions.commentsForEditor, `%${searchParams.q}%`)
      );
    }
    if (currentUser?.id) {
      if (searchParams.status) {
        conditions.push(
          eq(
            articleSubmissions.articleStatus,
            searchParams.status as (typeof ARTICLE_STATUS)[number]
          )
        );
      }
      if (
        (searchParams.f as (typeof articleFilters)[number]) ===
        'Assigned to review'
      ) {
        const article = await db
          .select({ articleId: reviewers.articleId })
          .from(reviewers)
          .where(eq(reviewers.userId, currentUser.id!));
        const ids = article.map((a) => String(a.articleId));
        conditions.push(inArray(articleSubmissions.id, ids));
      }
      conditions.push(eq(articleSubmissions.userId, currentUser.id));
    }
    return conditions.length > 0 ? and(...conditions) : undefined;
  };

  const articles = await db
    .select({
      id: articleSubmissions.id,
      commentsForEditor: articleSubmissions.commentsForEditor,
      fileURI: files.publicId,
      section: articleSubmissions.section,
      articleStatus: articleSubmissions.articleStatus,
      title: metadata.title, // Adding title from metadata
      owner: articleSubmissions.userId,
    })
    .from(articleSubmissions)
    .where(await where())
    // .rightJoin(reviewers, eq(articleSubmissions.id, reviewers.articleId))
    .leftJoin(files, eq(articleSubmissions.id, files.articleId))
    .leftJoin(metadata, eq(articleSubmissions.id, metadata.articleId));

  return (
    <main className="max-w-5xl mx-auto">
      <div>
        <div className="mb-10">
          <h2 className="text-2xl text-[#141A26] font-medium">
            Welcome back, {currentUser?.name}
          </h2>
          <p className="text-muted-foreground">
            You&apos;ve got {articles.length} submissions.
          </p>
        </div>

        <Tabs defaultValue="articles">
          <div className="flex justify-between">
            <TabsList className="w-full justify-start rounded-none border-b bg-transparent p-0">
              <ArticleFilters />
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
                  <ArticleSection
                    article={{
                      'Comments for the editor': a.commentsForEditor || '',
                      commentsForEditor: a.commentsForEditor || '',
                      fileURI: a.fileURI || '',
                      id: a.id || '',
                      requirements: [''],
                      section: a.section || 'Articles',
                      title: a.title || '',
                      articleStatus: a.articleStatus || 'Submitted',
                      owner: a.owner,
                    }}
                    key={i}
                    index={i}
                  />
                ))
              ) : (
                <div className="text-center text-muted-foreground">
                  No articles submitted yet. Click &apos;New Article&apos; to
                  get started
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
