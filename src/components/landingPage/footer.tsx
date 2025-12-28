import { FaTwitter, FaLinkedin } from 'react-icons/fa';
import Link from 'next/link';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import NewsletterSubscribeForm from './newsletter-subscribe-form';

const Footer = async () => {
  return (
    <footer className="text-gray-700 px-4 md:px-8 py-4 md:py-6">
      <div className="w-[98%] mx-auto border-t my-5 pt-5">
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
                <Link
                  href="/manuals#guidelines"
                  className="hover:text-blue-600"
                >
                  Instructions to authors
                </Link>
              </li>
              <li>
                <Link href="/manuals#policies" className="hover:text-blue-600">
                  Editorial policy
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-blue-600">
                  Copyright agreement
                </Link>
              </li>
              <li>
                <Link
                  href="/manuals/language-editing-authors"
                  className="hover:text-blue-600"
                >
                  Language editing for authors
                </Link>
              </li>
              <li>
                <Link
                  href="/manuals/scientific-editing-services"
                  className="hover:text-blue-600"
                >
                  Scientific editing for authors
                </Link>
              </li>
            </ul>
          </div>

          {/* About JAEHP Section */}
          <div>
            <h4 className="font-semibold text-lg text-gray-800">About JAEPH</h4>
            <ul className="text-sm mt-2 space-y-1">
              <li>
                <Link href="/manuals#aboutUs" className="hover:text-blue-600">
                  About us
                </Link>
              </li>
              <li>
                <Link href="/editorial-board" className="hover:text-blue-600">
                  Editorial board
                </Link>
              </li>
              <li className="hover:text-blue-600">
                <Popover>
                  <PopoverTrigger>Receive our newsletter</PopoverTrigger>
                  <PopoverContent align="start">
                    <NewsletterSubscribeForm />
                  </PopoverContent>
                </Popover>
              </li>
              <li>
                <Link href="contact-us" className="hover:text-blue-600">
                  Contact us
                </Link>
              </li>
              <li>
                <Link
                  href="/contact-us/#feedback"
                  className="hover:text-blue-600"
                >
                  Leave feedback
                </Link>
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
                <Link href="mailto:info@airpd.org" className="text-blue-500">
                  info@airpd.org
                </Link>
              </li>
              <li>
                WhatsApp-Phone:{' '}
                <Link
                  href="https://wa.me/+250788589658"
                  className="text-blue-500"
                >
                  +250788589658
                </Link>
              </li>
              <li>
                Website:{' '}
                <Link href="https://www.airpd.org" className="text-blue-500">
                  www.airpd.org
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Middle Section */}
        <div className="mt-8 text-center text-sm text-gray-600">
          By using this website, you agree to our{' '}
          <Link
            href="/manuals#termsNconditions"
            className="text-blue-600 hover:underline"
          >
            terms and conditions
          </Link>
          ,{' '}
          <Link href="/privacy" className="text-blue-600 hover:underline">
            Privacy statement
          </Link>
          , and{' '}
          <Link href="/cookies" className="text-blue-600 hover:underline">
            cookies policy
          </Link>
          .
        </div>
        <hr className="mt-6" />
        {/* Bottom Section */}
        <div className="mt-4 flex justify-between items-center text-sm text-gray-600">
          <span>© 2025 JAEPH. All rights reserved.</span>
          <div className="flex space-x-4">
            <Link
              href="https://twitter.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:text-blue-700"
            >
              <FaTwitter size={24} />
            </Link>
            {/* LinkedIn Icon */}
            <Link
              href="https://linkedin.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-700 hover:text-blue-900"
            >
              <FaLinkedin size={24} />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
