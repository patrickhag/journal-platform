import React from 'react';
import Image from 'next/image';
import { Recents } from '../Recents';
import { articleSubmissions, db, files, metadata } from '@/db/schema';
import { eq } from 'drizzle-orm';

const Collections = async () => {
  const fileCollections = await db
    .select({
      id: files.id,
      fileURI: files.publicId,
      title: metadata.title,
    })
    .from(articleSubmissions)
    .leftJoin(files, eq(articleSubmissions.id, files.articleId))
    .leftJoin(metadata, eq(articleSubmissions.id, metadata.articleId))
    .limit(10);

  return (
    <>
      <div className="col-span-3 space-y-6 md:space-y-8 lg:space-y-10">
        {/* Aims and Scope Section */}
        <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1
            className="text-xl font-bold mb-3 sm:text-2xl md:mb-4"
            style={{ color: '#1A237E' }}
          >
            Aims and scope
          </h1>
          <p className="text-gray-700 text-base sm:text-lg leading-relaxed">
            Lorem ipsum dolor sit amet... (your content here)
          </p>
        </div>

        <Recents />

        {/* Collections Section */}
        <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2
            className="text-xl font-bold mb-6 sm:text-2xl md:mb-8"
            style={{ color: '#1A237E' }}
          >
            Our largest collections
          </h2>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 md:gap-6 lg:gap-8">
            {fileCollections.map((collection) => (
              <div key={collection.id} className="group">
                <h3 className="text-base font-medium min-h-[50px] sm:text-lg md:text-xl">
                  {collection.title}
                </h3>
                <div className="relative overflow-hidden rounded-md transition-all duration-300 hover:shadow-lg">
                  <Image
                    src="https://res.cloudinary.com/dwhfpxrgz/image/upload/v1732723406/newss_espiuv.png"
                    width={500}
                    height={250}
                    alt={collection.title || ''}
                    className="w-full h-auto object-cover rounded-md transform transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Collections;
