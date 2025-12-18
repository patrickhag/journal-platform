import Image from 'next/image';
import { format } from 'date-fns';
import { getSectionImage } from '@/lib/utils';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import {
  articleSubmissions,
  db,
  metadata,
  publishedArticles,
  users,
} from '@/db/schema';
import { and, eq } from 'drizzle-orm';

const EditorsPickSection = async () => {
  const editorsPicks = await db
    .select({
      id: publishedArticles.id,
      slug: publishedArticles.slug,
      publishedAt: publishedArticles.publishedAt,
      section: articleSubmissions.section,
      title: metadata.title,
      prefix: metadata.prefix,
      firstName: users.firstName,
      lastName: users.lastName,
    })
    .from(publishedArticles)
    .innerJoin(
      articleSubmissions,
      eq(publishedArticles.articleId, articleSubmissions.id)
    )
    .innerJoin(metadata, eq(articleSubmissions.id, metadata.articleId))
    .innerJoin(users, eq(publishedArticles.userId, users.id))
    .where(
      and(
        eq(publishedArticles.status, 'PUBLISHED'),
        eq(articleSubmissions.isEditorsPick, true)
      )
    )
    .limit(4);

  console.log('editorsPicks:', editorsPicks);

  const gridClass =
    editorsPicks.length === 3
      ? 'grid grid-cols-1 md:grid-cols-3 gap-6'
      : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6';

  return (
    <>
      <div className="px-4 md:px-8">
        <h2 className="text-xl font-bold my-7 text-indigo-900">
          Editor&apos;s pick
        </h2>
        {editorsPicks.length === 0 ? (
          <p className="text-gray-500 italic">
            No editor&apos;s picks available at the moment.
          </p>
        ) : (
          <div className={gridClass}>
            {editorsPicks.map((item) => {
              const {
                id,
                publishedAt,
                slug,
                section,
                title,
                prefix,
                firstName,
                lastName,
              } = item;
              const fullName = `${prefix}. ${firstName} ${lastName}`;
              const imageUrl = getSectionImage(section);

              return (
                <Link key={id} href={`/articles/article/${slug}`}>
                  <div className="group rounded-lg overflow-hidden cursor-pointer transition relative">
                    <div className="relative rounded-lg">
                      <p className="font-semibold mb-2">{section}</p>
                      <Image
                        src={imageUrl}
                        width={300}
                        height={160}
                        className="w-full h-40 object-cover rounded-lg"
                        alt={section}
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-black rounded-lg bg-opacity-50 text-white p-2 flex items-center justify-between">
                        <p className="text-sm line-clamp-1">{title}</p>
                        <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200" />
                      </div>
                    </div>
                    <div className="mt-3">
                      <p className="text-gray-500 text-xs">{fullName}</p>
                      <p className="text-gray-500 text-xs">
                        {format(new Date(publishedAt as Date), 'MMM dd, yyyy')}
                      </p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
};

export default EditorsPickSection;
