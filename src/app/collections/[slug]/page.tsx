import { Calendar, User, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import LeftSideBar from '@/components/landingPage/leftSideBar';
import { collections } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { db } from '@/db/db';
import Link from 'next/link';
import { getSDGLabel } from '@/lib/utils';

const CollectionPage = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await params;

  const foundCollection = await db.query.collections.findFirst({
    where: eq(collections.slug, slug),
    with: {
      collectionArticles: {
        with: {
          articleSubmission: {
            columns: {
              id: true,
              articleStatus: true,
              updatedAt: true,
              section: true,
            },
            with: {
              metadata: {
                columns: {
                  title: true,
                  subtitle: true,
                  prefix: true,
                },
              },
              user: {
                columns: {
                  firstName: true,
                  lastName: true,
                },
              },
            },
          },
        },
      },
    },
  });

  if (!foundCollection) return <div>Collection not found</div>;

  return (
    <div className="min-h-screen bg-white">
      <main className="px-8 py-6">
        <section className="flex flex-col gap-8">
          <div className="grid grid-cols-4 gap-2">
            <div className="col-span-3 space-y-8 pr-5">
              <div className="mb-5">
                <div className="flex items-start gap-6 mb-6">
                  <img
                    src={foundCollection.thumbnailUrl as string}
                    alt={foundCollection.title}
                    className="w-32 h-24 object-cover rounded-lg border border-gray-200"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h1 className="text-3xl font-bold text-gray-900">
                        {foundCollection.title}
                      </h1>
                    </div>
                    <p className="text-gray-600 mb-4 leading-relaxed">
                      {foundCollection.description}
                    </p>
                    <div className="flex items-center gap-6 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <FileText className="w-4 h-4" />
                        {foundCollection.collectionArticles.length} article(s)
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(
                          foundCollection.createdAt as Date
                        ).toLocaleDateString()}
                      </span>
                      <Badge
                        variant="outline"
                        className="text-blue-700 border-blue-200"
                      >
                        SDG: {foundCollection.sdgGoal}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-12 bg-gray-50 rounded-lg p-6 mb-5">
                <h3 className="font-semibold text-gray-900 mb-4">
                  About this Collection
                </h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="font-medium text-gray-700">Focus:</p>
                    <span className="text-gray-600 mt-1">
                      {foundCollection.objective}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">
                      Linked SDG:
                    </span>
                    <p className="text-gray-600 mt-1">
                      {getSDGLabel(foundCollection.sdgGoal as string)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-blue-800">
                    Articles in this Collection
                  </h2>
                  <span className="text-sm text-gray-500">
                    {foundCollection.collectionArticles.length} article(s)
                  </span>
                </div>

                <div className="space-y-6">
                  {foundCollection.collectionArticles.map(
                    (articleEntry, index) => {
                      const article = articleEntry.articleSubmission;
                      return (
                        <article
                          key={articleEntry.articleId}
                          className="border-b border-gray-200 pb-6"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1">
                              <h3 className="text-xl font-semibold text-gray-900 mb-2 transition-colors">
                                {article.metadata.title}
                              </h3>
                              <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                                <span className="flex items-center gap-1">
                                  <User className="w-4 h-4" />
                                  by {article.user.firstName}{' '}
                                  {article.user.lastName}
                                </span>
                                <span className="text-gray-400">•</span>
                                <span>{article.section}</span>
                                <span className="text-gray-400">•</span>
                                <span>
                                  {new Date(
                                    article.updatedAt ?? new Date()
                                  ).toLocaleDateString()}
                                </span>
                              </div>
                              <div className="text-gray-600 text-sm leading-relaxed mb-3">
                                {article.metadata.subtitle || ''}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-500">
                              Article {index + 1} of{' '}
                              {foundCollection.collectionArticles.length}
                            </span>
                            <Link href={`/articles/article${article.id}`}>
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-blue-700 border-blue-200 hover:bg-blue-50"
                              >
                                Read Article
                              </Button>
                            </Link>
                          </div>
                        </article>
                      );
                    }
                  )}
                </div>
              </div>
            </div>
            <LeftSideBar />
          </div>
        </section>
      </main>
    </div>
  );
};

export default CollectionPage;
