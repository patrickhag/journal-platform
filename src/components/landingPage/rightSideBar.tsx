import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import React from 'react';
import SearchBar from './searchBar';

const RightSideBar = () => {
  return (
    <div>
      <SearchBar />
      <h2 className="text-xl font-bold my-7" style={{ color: '#1A237E' }}>
        Editor&apos;s pick
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="rounded-lg overflow-hidden">
          <div className="relative rounded-lg">
            <p className="font-semibold mb-2">Case Study</p>
            {/* Image */}
            <Image
              src="https://res.cloudinary.com/dwhfpxrgz/image/upload/v1732708303/old-books-wooden-table-library-vintage-style-ai-generated-content-design-background-instagram-facebook-wall-323974717_kbravu.webp"
              width={90}
              height={90}
              className="w-full h-40 object-cover rounded-lg"
              alt="Case Study"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2">
              <p className="text-sm">
                Lorem ipsum dolor sit amet orem ipsum dolor sit amet.
              </p>
            </div>
          </div>
          <div className="mt-3">
            <p className="text-gray-500 text-xs">Charles et Patrick</p>
            <p className="text-gray-500 text-xs">28 Sept 2024</p>
          </div>
        </div>

        <div className="rounded-lg overflow-hidden">
          <div className="relative rounded-lg">
            <p className="font-semibold mb-2">Original study</p>
            {/* Image */}
            <Image
              src="https://res.cloudinary.com/dwhfpxrgz/image/upload/v1732708303/old-books-wooden-table-library-vintage-style-ai-generated-content-design-background-instagram-facebook-wall-323974717_kbravu.webp"
              className="w-full h-40 object-cover rounded-lg"
              alt="Case Study"
              width={90}
              height={90}
            />
            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2">
              <p className="text-sm">
                Lorem ipsum dolor sit amet orem ipsum dolor sit amet.
              </p>
            </div>
          </div>
          <div className="mt-3">
            <p className="text-gray-500 text-xs">Charles et Patrick</p>
            <p className="text-gray-500 text-xs">28 Sept 2024</p>
          </div>
        </div>

        <div className="rounded-lg overflow-hidden">
          <div className="relative rounded-lg">
            <p className="font-semibold mb-2">Case report</p>
            {/* Image */}
            <Image
              width={90}
              height={90}
              src="https://res.cloudinary.com/dwhfpxrgz/image/upload/v1732708303/old-books-wooden-table-library-vintage-style-ai-generated-content-design-background-instagram-facebook-wall-323974717_kbravu.webp"
              className="w-full h-40 object-cover rounded-lg"
              alt="Case Study"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2">
              <p className="text-sm">
                Lorem ipsum dolor sit amet orem ipsum dolor sit amet.
              </p>
            </div>
          </div>
          <div className="mt-3">
            <p className="text-gray-500 text-xs">Charles et Patrick</p>
            <p className="text-gray-500 text-xs">28 Sept 2024</p>
          </div>
        </div>

        <div className="rounded-lg overflow-hidden">
          <div className="relative rounded-lg">
            <p className="font-semibold mb-2">Case Study</p>
            {/* Image */}
            <Image
              width={90}
              height={90}
              src="https://res.cloudinary.com/dwhfpxrgz/image/upload/v1732708303/old-books-wooden-table-library-vintage-style-ai-generated-content-design-background-instagram-facebook-wall-323974717_kbravu.webp"
              className="w-full h-40 object-cover rounded-lg"
              alt="Case Study"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2">
              <p className="text-sm">
                Lorem ipsum dolor sit amet orem ipsum dolor sit amet.
              </p>
            </div>
          </div>
          <div className="mt-3">
            <p className="text-gray-500 text-xs">Charles et Patrick</p>
            <p className="text-gray-500 text-xs">28 Sept 2024</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RightSideBar;
