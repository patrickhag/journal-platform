import { FaTwitter, FaLinkedin } from 'react-icons/fa';
import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-50 text-gray-700 border-t py-8">
      <div className="container mx-auto px-4">
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* JAEPH Address Section */}
          <div>
            <h4 className="font-semibold text-lg text-gray-800">
              JAEPH Address
            </h4>
            <p className="text-sm mt-2">
              The JAEPH is a product of African institute of research for public
              health and development.
            </p>
          </div>

          {/* For Authors Section */}
          <div>
            <h4 className="font-semibold text-lg text-gray-800">For authors</h4>
            <ul className="text-sm mt-2 space-y-1">
              <li>
                <a href="#" className="hover:text-blue-600">
                  Instructors to authors
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-600">
                  Editorial policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-600">
                  Copyright agreement
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-600">
                  Language editing for authors
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-600">
                  Scientific editing for authors
                </a>
              </li>
            </ul>
          </div>

          {/* About JAEHP Section */}
          <div>
            <h4 className="font-semibold text-lg text-gray-800">About JAEPH</h4>
            <ul className="text-sm mt-2 space-y-1">
              <li>
                <a href="#" className="hover:text-blue-600">
                  About us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-600">
                  Editorial board
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-600">
                  Receive our newsletter
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-600">
                  Support and contact us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-600">
                  Leave feedback
                </a>
              </li>
            </ul>
          </div>

          {/* For Advertisement Section */}
          <div>
            <h4 className="font-semibold text-lg text-gray-800">
              For advertisement
            </h4>
            <ul className="text-sm mt-2 space-y-1">
              <li>
                Email:{' '}
                <a href="mailto:info@airpd.org" className="text-blue-500">
                  info@airpd.org
                </a>
              </li>
              <li>Phone: 07xxxxxxxx</li>
              <li>
                Website:{' '}
                <a href="https://www.airpd.org" className="text-blue-500">
                  www.airpd.org
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Middle Section */}
        <div className="mt-8 text-center text-sm text-gray-600 ">
          By using this website, you agree to our terms and conditions, Privacy
          statement, and cookies policy.
        </div>
        <hr className="mt-6" />
        {/* Bottom Section */}
        <div className="mt-4 flex justify-between items-center text-sm text-gray-600">
          <span>© 2024 JAEPH. All rights reserved.</span>
          <div className="flex space-x-4">
            <a
              href="https://twitter.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:text-blue-700"
            >
              <FaTwitter size={24} />
            </a>
            {/* LinkedIn Icon */}
            <a
              href="https://linkedin.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-700 hover:text-blue-900"
            >
              <FaLinkedin size={24} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
