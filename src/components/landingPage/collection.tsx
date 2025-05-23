import React from 'react';
import Image from 'next/image';
import { Recents } from '../Recents';
import { db } from '@/db/db';

const Collections = async () => {
  const foundManual = await db.query.manuals.findFirst();

  return (
    <>
      <div className="col-span-3 space-y-6 md:space-y-2 lg:space-y-10">
        {/* Aims and Scope Section */}
        <div className="w-">
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
        <div className="w-full max-w-4xl">
          <h2
            className="text-xl font-bold mb-6 sm:text-2xl md:mb-8"
            style={{ color: '#1A237E' }}
          >
            Our largest collections
          </h2>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 md:gap-6 lg:gap-8">
            <div className="group">
              <h3 className="text-base font-medium min-h-[50px] sm:text-lg md:text-xl">
                title
              </h3>
              <div className="relative overflow-hidden rounded-md transition-all duration-300 hover:shadow-lg">
                <Image
                  src="https://res.cloudinary.com/dwhfpxrgz/image/upload/v1732723406/newss_espiuv.png"
                  width={500}
                  height={250}
                  alt="title"
                  className="w-full h-auto object-cover rounded-md transform transition-transform duration-300 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              </div>
            </div>
            {/* ))} */}
          </div>
        </div>
      </div>
    </>
  );
};

export default Collections;
