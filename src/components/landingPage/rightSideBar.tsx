import Image from 'next/image';
import HeroSection from './heroSection';
import { format } from 'date-fns';
import { getSectionImage } from '@/lib/utils';
import { articleSubmissions } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { db } from '@/db/db';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

const RightSideBar = async () => {
  const editorsPicks = await db.query.articleSubmissions.findMany({
    columns: {
      id: true,
      section: true,
      updatedAt: true,
    },
    with: {
      metadata: {
        columns: {
          title: true,
        },
      },
      user: {
        columns: {
          firstName: true,
          lastName: true,
        },
      },
    },
    where: eq(articleSubmissions.isEditorsPick, true),
  });

  const articles = editorsPicks.slice(0, 4);

  const gridClass =
    articles.length === 3
      ? 'grid grid-cols-1 md:grid-cols-3 gap-6'
      : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6';

  return (
    <div>
      <HeroSection />
      <h2 className="text-xl font-bold my-7 text-indigo-900">
        Editor&apos;s pick
      </h2>

      <div className={gridClass}>
        {editorsPicks.map((article) => {
          const { id, section, metadata, user, updatedAt } = article;
          const fullName =
            `${user?.firstName ?? ''} ${user?.lastName ?? ''}`.trim();
          const imageUrl = getSectionImage(section);

          return (
            <Link key={id} href={`/articles/article/${id}`}>
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
                    <p className="text-sm line-clamp-1">
                      {metadata?.title || 'Untitled Article'}
                    </p>
                    <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200" />
                  </div>
                </div>
                <div className="mt-3">
                  <p className="text-gray-500 text-xs">
                    {fullName || 'Unknown Author'}
                  </p>
                  <p className="text-gray-500 text-xs">
                    {format(new Date(updatedAt as string), 'MMM dd, yyyy')}
                  </p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default RightSideBar;
