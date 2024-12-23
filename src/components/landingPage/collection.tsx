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
    <div className="col-span-3 space-y-8">
      <div className="w-[90%]">
        <h1 className="text-2xl font-bold mb-4 " style={{ color: '#1A237E' }}>
          Aims and scope
        </h1>
        <p className="text-gray-700">
          Lorem ipsum dolor sit amet Lorem ipsum dolor sit amet Lorem ipsum
          dolor sit amet Lorem ipsum dolor sit amet Lorem ipsum dolor sit amet
          Lorem ipsum dolor sit amet Lorem ipsum dolor sit amet Lorem ipsum
          Lorem dolor sit amet Lorem ipsum dolor sit amet Lorem ipsum dolor sit
          amet Lorem ipsum dolor sit amet Lorem ipsum dolor sit amet Lorem ipsum
          dolor sit amet Lorem ipsum dolor sit amet Lorem ipsum dolor sit amet
        </p>
      </div>

      <Recents />
      <div className="w-[70%]">
        <h2 className="text-2xl font-bold mb-8" style={{ color: '#1A237E' }}>
          Our largest collections
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {fileCollections.map((collection) => (
            <div key={collection.id}>
              <h3 className="text-lg font-medium">{collection.title}</h3>
              <Image
                src={
                  'https://res.cloudinary.com/dwhfpxrgz/image/upload/v1732723406/newss_espiuv.png'
                }
                width={500}
                height={250}
                alt={collection.title || ''}
                objectFit="cover"
                className="rounded-md mb-2 p-2 shadow-md hover:shadow-lg transition"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Collections;
