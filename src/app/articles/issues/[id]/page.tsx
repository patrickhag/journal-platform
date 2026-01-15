'use client';

import { Button } from '@/components/ui/button';
import { useGetIssue } from '@/hooks/useIssues';
import { useParams, useRouter } from 'next/navigation';
import SkeletonHeader from '../components/SkeletonHeader';
import SkeletonArticleCard from '../components/SkeletonArticleCard';
import { format } from 'date-fns';
import Link from 'next/link';

function IssuePage() {
  const router = useRouter();
  const params = useParams();
  const issueId = params.id;

  const { data: issue, isPending } = useGetIssue(issueId as string);

  return (
    <div className="md:col-span-2">
      {isPending ? (
        <>
          <SkeletonHeader />
          <div className="bg-white rounded-lg shadow-sm border border-gray-100">
            {Array.from({ length: 4 }).map((_, index) => (
              <SkeletonArticleCard key={index} />
            ))}
          </div>
        </>
      ) : (
        <>
          <header className="bg-white border-b mb-3">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Button
                    variant="secondary"
                    className="text-blue-900 hover:bg-blue-50"
                    onClick={() => router.back()}
                  >
                    ← All issues
                  </Button>

                  <h1 className="text-xl font-bold text-blue-900">
                    Volume {issue?.volume?.volumeNumber}, Issue{' '}
                    {issue?.issueNumber} •{' '}
                    {format(new Date(issue?.publicationDate ?? ''), 'yyyy')}
                  </h1>
                </div>
              </div>
            </div>
          </header>

          <div className="bg-white rounded-lg shadow-sm border border-gray-100">
            {issue?.articles && issue.articles.length > 0 ? (
              issue.articles.map((article) => (
                <div
                  key={article.id}
                  className="p-6 border-b border-gray-100 last:border-b-0"
                >
                  <Link
                    href={`/articles/article/${article.slug}`}
                    target="_blank"
                    className="text-xl font-semibold text-blue-800 hover:text-blue-900 mb-2 line-clamp-1 hover:underline"
                  >
                    {article.article.metadata.title}
                  </Link>
                  <p className="text-gray-600 mb-2">
                    {`${article.article.metadata.prefix}. ${article.article.user.firstName} ${article.article.user.lastName}`}
                  </p>
                  {article.article.contributors &&
                    article.article.contributors.length > 0 && (
                      <p className="text-gray-500 mb-2 text-sm">
                        Contributors:{' '}
                        {article.article.contributors
                          .map(
                            (c: { name: string; salutation: string }) =>
                              c.salutation + ' ' + c.name
                          )
                          .join(', ')}
                      </p>
                    )}
                  <div className="flex flex-wrap gap-2 mt-2">
                    {article.article.metadata.topics &&
                    article.article.metadata.topics.length > 0 ? (
                      article.article.metadata.topics.map(
                        (topic: string, index: number) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm"
                          >
                            {topic}
                          </span>
                        )
                      )
                    ) : (
                      <span className="text-gray-400 text-sm">
                        No topics listed
                      </span>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 p-6">
                No articles in this issue available.
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default IssuePage;
