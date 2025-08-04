import { collections } from '@/db/schema';
import { Recents } from '../Recents';
import { db } from '@/db/db';
import { eq } from 'drizzle-orm';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

const Collections = async () => {
  const foundManual = await db.query.manuals.findFirst();
  const featuredCollections = await db.query.collections.findMany({
    where: eq(collections.isFeatured, true),
    limit: 3,
  });

  return (
    <>
      <div className="col-span-3 space-y-6 md:space-y-2 lg:space-y-10">
        {/* Aims and Scope Section */}
        <div>
          <h1
            className="text-xl font-bold mb-3 sm:text-2xl md:mb-4"
            style={{ color: '#1A237E' }}
          >
            Aims and scope
          </h1>
          <div
            className="prose max-w-none"
            dangerouslySetInnerHTML={{
              __html: foundManual?.aimsNscope?.content as string,
            }}
          />
        </div>

        <Recents />

        {/* Collections Section */}
        <div className="w-full max-w-7xl">
          <div>
            <h2
              className="text-xl font-bold mb-6 sm:text-2xl md:mb-8"
              style={{ color: '#1A237E' }}
            >
              Our largest collections
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 md:gap-6 lg:gap-8">
            {featuredCollections.map((collection) => (
              <Link
                key={collection.id}
                href={`/collections/${collection.slug}`}
                className="group relative block rounded-lg shadow-md transition-shadow duration-300 overflow-hidden"
              >
                {/* Title above the image */}
                <p className="text-sm font-semibold text-gray-800 mb-2 line-clamp-1">
                  {collection.title}
                </p>

                {/* Image container */}
                <div className="relative w-full rounded-lg overflow-hidden">
                  <img
                    src={collection.thumbnailUrl as string}
                    alt={collection.title}
                    className="w-full h-full object-cover"
                  />

                  {/* Overlay with SDG + ArrowRight */}
                  <div className="absolute bottom-0 left-0 right-0 bg-black rounded-lg bg-opacity-50 text-white p-2 flex items-center justify-between">
                    <div className="flex items-center justify-between w-full px-3 py-2 text-white">
                      <p className="text-sm font-medium truncate">
                        SDG: {collection.sdgGoal}
                      </p>
                      <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Collections;
