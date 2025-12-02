import { Calendar, User, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import LeftSideBar from '@/components/landingPage/leftSideBar';
import { collections } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { db } from '@/db/db';
import Link from 'next/link';
import { getSDGLabel } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const CollectionPage = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await params;

  const foundCollection = await db.query.collections.findFirst({
    where: eq(collections.slug, slug),
    with: {
      user: {
        columns: {
          id: true,
          prefix: true,
          firstName: true,
          lastName: true,
          affiliation: true,
          avatar: true,
          bio: true,
        },
      },
      collectionUsers: {
        with: {
          user: {
            columns: {
              id: true,
              prefix: true,
              firstName: true,
              lastName: true,
              affiliation: true,
              avatar: true,
              bio: true,
            },
          },
        },
      },
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

              {/* Editors Section */}

              <div className="mt-12 bg-gray-50 rounded-lg p-6 mb-5">
                <h3 className="font-semibold text-gray-900 mb-4">
                  About this Collection
                </h3>
                <div className="space-y-4 text-sm">
                  <div>
                    <p className="font-medium text-gray-700 mb-1">Focus:</p>
                    <span className="text-gray-600">
                      {foundCollection.objective || 'Not specified'}
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
                  {(foundCollection as any).deadline && (
                    <div>
                      <span className="font-medium text-gray-700">
                        Deadline:
                      </span>
                      <p className="text-gray-600 mt-1">
                        {new Date(
                          (foundCollection as any).deadline
                        ).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                    </div>
                  )}
                </div>
              </div>
              {foundCollection.collectionUsers &&
                foundCollection.collectionUsers.length > 0 && (
                  <div className="mt-12 mb-5">
                    <h3 className="font-semibold text-gray-900 mb-4">
                      Editors
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {foundCollection.collectionUsers.map((cu) => {
                        const editor = cu.user;
                        return (
                          <div
                            key={cu.id}
                            className="bg-gray-50 rounded-lg p-6"
                          >
                            <div className="flex items-start gap-4">
                              {editor.avatar ? (
                                <Avatar className="w-16 h-16 border-2 border-gray-200 flex-shrink-0">
                                  <AvatarImage
                                    src={editor.avatar}
                                    alt={`${editor.firstName} ${editor.lastName}`}
                                    className="object-cover"
                                  />
                                  <AvatarFallback className="bg-gradient-to-br from-sky-500 to-indigo-500 text-white text-lg font-semibold">
                                    {editor.firstName
                                      ?.charAt(0)
                                      .toUpperCase() || 'U'}
                                  </AvatarFallback>
                                </Avatar>
                              ) : (
                                <div className="w-16 h-16 bg-gradient-to-br from-sky-500 to-indigo-500 rounded-full flex items-center justify-center flex-shrink-0 border-2 border-gray-200">
                                  <span className="text-white font-semibold text-lg">
                                    {editor.firstName
                                      ?.charAt(0)
                                      .toUpperCase() || 'U'}
                                  </span>
                                </div>
                              )}
                              <div className="flex-1 min-w-0">
                                <p className="text-gray-900 font-medium mb-1">
                                  {editor.prefix && (
                                    <span>{editor.prefix}. </span>
                                  )}
                                  {editor.firstName} {editor.lastName}
                                </p>
                                {editor.affiliation && (
                                  <p className="text-gray-600 text-sm mb-2">
                                    {editor.affiliation}
                                  </p>
                                )}
                                {editor.bio && (
                                  <p className="text-gray-600 text-sm leading-relaxed mt-2">
                                    {editor.bio}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

              {/* RESERVED SPACE FOR IMPACT */}
              <div className="mt-12 bg-gray-50 rounded-lg p-6 mb-5">
                <h3 className="font-semibold text-gray-900 mb-4">
                  Space for Impact
                </h3>
              </div>

              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-blue-800">
                    Articles in this Collection
                  </h2>
                  {foundCollection.collectionArticles.length > 0 && (
                    <span className="text-sm text-gray-500">
                      {foundCollection.collectionArticles.length} article
                      {foundCollection.collectionArticles.length > 1 ? 's' : ''}
                    </span>
                  )}
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
                                  by{' '}
                                  {article.metadata.prefix && (
                                    <span>{article.metadata.prefix}. </span>
                                  )}
                                  {article.user.firstName}{' '}
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
                  {foundCollection.collectionArticles.length === 0 && (
                    <div className="flex items-center justify-center">
                      <p className="text-gray-500">
                        Articles will appear here when they are published.
                      </p>
                    </div>
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
