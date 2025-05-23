import { articleSubmissions, contributors } from '@/db/schema';
import { db } from '@/db/db';
import { eq } from 'drizzle-orm';
import { Separator } from './ui/separator';
import Link from 'next/link';

export const Recents = async () => {
  const articles = await db.query.articleSubmissions.findMany({
    columns: {
      id: true,
      section: true,
      updatedAt: true,
    },
    with: {
      metadata: {
        columns: {
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
    where: eq(articleSubmissions.articleStatus, 'PUBLISHED'),
  });

  return (
    <div className="w-full sm:px-2 md:px-0">
      <h2 className="text-xl font-bold mb-4" style={{ color: '#1A237E' }}>
        Recently Published
      </h2>
      {articles.map((article) => {
        return (
          <div key={article.id} className="my-6 w-[90%]">
            <div className="space-y-1">
              <h2 className="text-xl font-medium hover:text-blue-500 cursor-pointer leading-snug">
                <Link href={`/articles/article/${article.id}`}>
                  {article.metadata.title}
                </Link>
              </h2>
              <p className="text-gray-800 font-medium">
                by {article.user.firstName + ' ' + article.user.lastName}
              </p>
              <p className="text-gray-700">{article.metadata.subtitle}</p>

              <div className="text-sm text-gray-500 flex space-x-2">
                <span>{article.section}</span>
                <span>•</span>
                <span>{article.updatedAt}</span>
              </div>
            </div>
            <Separator className="mt-2" />
          </div>
        );
      })}
    </div>
  );
};
