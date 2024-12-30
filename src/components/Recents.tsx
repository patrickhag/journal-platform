import {
  articleSubmissions,
  contributors,
  db,
  files,
  metadata,
} from '@/db/schema';
import { eq } from 'drizzle-orm';
import { FileText } from 'lucide-react';
import Link from 'next/link';

export const Recents = async () => {
  const articles = await db
    .select({
      id: articleSubmissions.id,
      createdAt: articleSubmissions.createdAt,
      title: metadata.title,
      file: files.publicId,
      fileName: files.originalName,
    })
    .from(articleSubmissions)
    .leftJoin(metadata, eq(articleSubmissions.id, metadata.articleId))
    .leftJoin(files, eq(articleSubmissions.id, files.articleId))
    .where(eq(articleSubmissions.articleStatus, 'Published'))
    .limit(10);

  console.log(articles);

  return (
    <div>
      <h2 className="text-xl font-bold mb-4" style={{ color: '#1A237E' }}>
        Recently Published
      </h2>
      {articles.map((a) => {
        return (
          <div key={a.id} className="my-6 w-[90%]">
            <div>
              <div className="flex items-center justify-between">
                <Link
                  href={`/articles/${a.id}`}
                  className="text-lg text-blue-500 hover:text-blue-600"
                >
                  {a.title}
                </Link>

                <p className="text-sm text-gray-500">{a.createdAt}</p>
              </div>
              <ContributorList articleId={a.id} />
            </div>
            <div className="text-gray-600 cursor-pointer">
              <Link href={a.file as string}>
                <span className="flex items-center gap-2 hover:text-blue-500">
                  <FileText size={20} />
                  {a.fileName}
                </span>
              </Link>
            </div>
            <div className="border-b pb-4"></div>
          </div>
        );
      })}
    </div>
  );
};
const ContributorList = async ({ articleId }: { articleId: string }) => {
  const contributorList = await db
    .select()
    .from(contributors)
    .where(eq(contributors.articleId, articleId));
  return (
    <p className="text-sm text-gray-600 my-1">
      {contributorList.map((c) => (
        <span key={c.id}>{c.name}</span>
      ))}
    </p>
  );
};
