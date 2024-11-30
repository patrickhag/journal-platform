import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import React from "react";

const RightSideBar = () => {
  return (
    <div>
      <h1
        className="text-3xl font-bold text-center mb-4"
        style={{ color: "#141A26" }}
      >
        JAEPH is calling for new manuscripts
      </h1>
      <div className="flex items-center border ml-[38%] border-gray-300 rounded-md px-3 py-2 shadow-sm w-80">
        <input
          type="text"
          placeholder="Search journals..."
          className="flex-1 outline-none border-none text-gray-700 placeholder-gray-400"
        />
        <button type="button">
          <MagnifyingGlassIcon className="w-5 h-5 text-gray-400" />
        </button>
      </div>
      <h2 className="text-xl font-bold mt-9" style={{ color: "#1A237E" }}>
        Editor&apos;s pick
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="rounded-lg overflow-hidden">
          <div className="relative rounded-lg">
            <p className="font-semibold mb-2">Case Study</p>
            {/* Image */}
            <img
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
            <p className="font-semibold mb-2">Original study</p>
            {/* Image */}
            <img
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
            <p className="font-semibold mb-2">Case report</p>
            {/* Image */}
            <img
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
            <img
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
