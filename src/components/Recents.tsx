import { articleSubmissions, publishedArticles } from '@/db/schema';
import { db } from '@/db/db';
import { eq } from 'drizzle-orm';
import { Separator } from './ui/separator';
import Link from 'next/link';
import { format } from 'date-fns';

export const Recents = async () => {
  const foundPublishedArticles = await db.query.publishedArticles.findMany({
    where: eq(publishedArticles.status, 'PUBLISHED'),
    columns: {
      id: true,
      publishedAt: true,
      slug: true,
    },
    with: {
      article: {
        columns: {
          id: true,
          section: true,
        },
        with: {
          metadata: {
            columns: {
              prefix: true,
              title: true,
              subtitle: true,
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
    limit: 5,
  });

  return (
    <div className="w-full sm:px-2 md:px-0">
      <h2 className="text-xl font-bold mb-4" style={{ color: '#1A237E' }}>
        Recently Published
      </h2>
      {foundPublishedArticles.map((article) => {
        const articleData = article.article;
        const authorNames = `${articleData.metadata.prefix} ${articleData.user.firstName} ${articleData.user.lastName}`;
        return (
          <div key={article.id} className="my-6 w-[90%]">
            <div className="space-y-1">
              <h2 className="text-xl font-medium hover:text-blue-500 cursor-pointer leading-snug">
                <Link href={`/articles/article/${article.slug}`}>
                  {articleData.metadata.title}
                </Link>
              </h2>
              <p className="text-gray-800 font-medium">by {authorNames}</p>
              <p className="text-gray-700">{articleData.metadata.subtitle}</p>

              <div className="text-sm text-gray-500 flex space-x-2">
                <span>{articleData.section}</span>
                <span>•</span>
                <span>{format(article.publishedAt as Date, 'yyyy-MM-dd')}</span>
              </div>
            </div>
            <Separator className="mt-2" />
          </div>
        );
      })}
    </div>
  );
};
