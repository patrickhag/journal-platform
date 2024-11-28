import React from "react";
import { EyeIcon } from "@heroicons/react/24/outline";

const LeftSideBar = () => {
  return (
    <div className="w-64 bg-gray-50 p-4 space-y-6 border-r border-gray-200">
      {/* Important Information Section */}
      <div>
        <h2 className="text-lg font-semibold text-gray-700" style={{color: "#1A237E" }}>
          Important Information
        </h2>
        <ul className="mt-2 space-y-2 text-sm text-gray-600">
          <li>
            <a href="#" className="hover:text-blue-600">
              Editorial board
            </a>
          </li>
          <li>
            <a href="#" className="hover:text-blue-600" >
              Submission guidelines
            </a>
          </li>
          <li>
            <a href="#" className="hover:text-blue-600">
              Manuscript editing services
            </a>
          </li>
          <li>
            <a href="#" className="hover:text-blue-600">
              Supplements
            </a>
          </li>
          <li>
            <a href="#" className="hover:text-blue-600">
              Collections
            </a>
          </li>
          <li>
            <a href="#" className="hover:text-blue-600">
              Contact us
            </a>
          </li>
        </ul>
      </div>

      {/* Supplements Section */}
      <div>
        <h2 className="text-lg font-semibold text-gray-700" style={{ color: "#1A237E" }}>Supplements</h2>
        <ul className="mt-2 space-y-2 text-sm text-gray-600">
          <li>
            <a href="#" className="hover:text-blue-600">
              Our supplements
            </a>
          </li>
          <li>
            <a href="#" className="hover:text-blue-600">
              Upcoming supplements
            </a>
          </li>
          <li>
            <a href="#" className="hover:text-blue-600">
              Publish supplements
            </a>
          </li>
          <li>
            <a href="#" className="hover:text-blue-600">
              Note to institutions
            </a>
          </li>
        </ul>
      </div>

      {/* Most Accessed Section */}
      <div>
        <h2 className="text-lg font-semibold text-gray-700" style={{ color: "#1A237E" }}>Most Accessed</h2>
        <ul className="mt-2 space-y-4">
          {[1, 2, 3].map((item) => (
            <li key={item} className="text-sm text-gray-600">
              <a href="#" className="block hover:text-blue-600">
                Lorem ipsum article has been posted has been posted has been
                posted
              </a>
              <div className="text-xs text-gray-500 flex items-center space-x-1">
                <span className="material-icons text-base text-gray-400">
                  <EyeIcon className="h-6 w-6 text-gray-600" />
                </span>
                <span>2023 views</span>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Reserved for Ads Section */}
      <div>
        <h2 className="text-lg font-semibold text-gray-700" style={{color: "#1A237E" }}>
          Reserved for Ads
        </h2>
        <div className="mt-2">
          <img
            src="https://res.cloudinary.com/dwhfpxrgz/image/upload/v1732723406/newss_espiuv.png"
            alt="Ad Placeholder"
            className="w-full h-auto border border-gray-300 rounded-md"
          />
        </div>
      </div>

      {/* Archives Section */}
      <div>
        <h2 className="text-lg font-semibold text-gray-700" style={{color: "#1A237E" }}>Archives</h2>
        <ul className="mt-2 space-y-2 text-sm text-gray-600">
          {[4, 3, 2, 1].map((year) => (
            <li key={year}>
              <a href="#" className="hover:text-blue-600">
                Volume {year}-2024 (20)
              </a>
            </li>
          ))}
        </ul>
      </div>

      {/* Downloads Section */}
      <div>
        <h2 className="text-lg font-semibold text-gray-700" style={{ color: "#1A237E" }}>Downloads</h2>
        <ul className="mt-2 space-y-2 text-sm text-gray-600">
          <li>
            <a href="#" className="hover:text-blue-600">
              Copyright form
            </a>
          </li>
          <li>
            <a href="#" className="hover:text-blue-600">
              Paper template
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default LeftSideBar;
