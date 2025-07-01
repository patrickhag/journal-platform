import { Recents } from '../Recents';
import { db } from '@/db/db';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

const Collections = async () => {
  const foundManual = await db.query.manuals.findFirst();
  const allCollections = await db.query.collections.findMany();

  const featuredCollections = allCollections.filter(
    (collection) => collection.isFeatured
  );

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
                className="group relative block rounded-lg shadow-md transition-shadow duration-300"
              >
                <div className="overflow-hidden rounded-t-lg">
                  <img
                    src={collection.thumbnailUrl as string}
                    width={500}
                    height={180}
                    alt={collection.title}
                    className="w-full h-auto object-cover rounded-t-lg transform transition-transform duration-300 group-hover:scale-105"
                  />
                </div>

                <div className="bg-white p-4 rounded-b-lg space-y-1">
                  <h3 className="text-lg font-semibold text-indigo-900">
                    {collection.title}
                  </h3>
                  {/* <p className="text-sm text-gray-600 line-clamp-2">
                    {collection.objective}
                  </p> */}
                  <div className="text-xs font-medium text-green-700 bg-green-100 px-2 py-1 inline-block rounded">
                    SDG: {collection.sdgGoal}
                  </div>
                </div>

                {/* Arrow icon in bottom-right on hover */}
                <ArrowRight
                  className="absolute bottom-4 right-4 text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  size={18}
                />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Collections;
