import React from 'react';
import Image from 'next/image';

const Collections = () => {
  const collections = [
    {
      id: 1,
      title: 'Lorem ipsum collection 1',
      image:
        'https://res.cloudinary.com/dwhfpxrgz/image/upload/v1732723406/newss_espiuv.png',
    },
    {
      id: 2,
      title: 'Lorem ipsum collection 2',
      image:
        'https://res.cloudinary.com/dwhfpxrgz/image/upload/v1732723406/newss_espiuv.png',
    },
    {
      id: 3,
      title: 'Lorem ipsum collection 3',
      image:
        'https://res.cloudinary.com/dwhfpxrgz/image/upload/v1732723406/newss_espiuv.png',
    },
    {
      id: 4,
      title: 'Lorem ipsum collection 3',
      image:
        'https://res.cloudinary.com/dwhfpxrgz/image/upload/v1732723406/newss_espiuv.png',
    },
  ];

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

      <div>
        <h2 className="text-xl font-bold mb-4" style={{ color: '#1A237E' }}>
          Recently Published
        </h2>
        <div className="space-y-6 w-[90%]">
          {/* Article 1 */}
          <div className="border-b pb-4">
            <h3 className="font-semibold text-lg text-gray-800">
              Lorem ipsum article has been posted has been posted has been
              posted
            </h3>
            <p className="text-sm text-gray-600">
              Bizimana Jean, Peter Thiel, Peter Thiel
            </p>
            <p className="text-sm text-gray-500">30 October 2023</p>
          </div>
        </div>

        <div className="space-y-6 w-[90%]">
          {/* Article 1 */}
          <div className="border-b pb-4">
            <h3 className="font-semibold text-lg text-gray-800">
              Lorem ipsum article has been posted has been posted has been
              posted
            </h3>
            <p className="text-sm text-gray-600">
              Bizimana Jean, Peter Thiel, Peter Thiel
            </p>
            <p className="text-sm text-gray-500">30 October 2023</p>
          </div>
        </div>

        <div className="space-y-6 w-[90%]">
          {/* Article 1 */}
          <div className="border-b pb-4">
            <h3 className="font-semibold text-lg text-gray-800">
              Lorem ipsum article has been posted has been posted has been
              posted
            </h3>
            <p className="text-sm text-gray-600">
              Bizimana Jean, Peter Thiel, Peter Thiel
            </p>
            <p className="text-sm text-gray-500">30 October 2023</p>
          </div>
        </div>
      </div>
      <div className="w-[70%]">
        <h2 className="text-2xl font-bold mb-8" style={{ color: '#1A237E' }}>
          Our largest collections
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {collections.map((collection) => (
            <div key={collection.id}>
              <h3 className="text-lg font-medium">{collection.title}</h3>
              <Image
                src={collection.image}
                width={500}
                height={250}
                alt={collection.title}
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
