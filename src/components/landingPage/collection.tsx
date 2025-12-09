import { collections, TCollections } from '@/db/schema';
import { Recents } from '../Recents';
import { db } from '@/db/db';
import { eq } from 'drizzle-orm';
import FeaturedCollections from './FeaturedCollections';

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
              <FeaturedCollections
                key={collection.id}
                collection={collection}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Collections;
