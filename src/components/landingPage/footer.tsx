import { FaTwitter, FaLinkedin } from 'react-icons/fa';
import Link from 'next/link';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import NewsletterSubscribeForm from './newsletter-subscribe-form';
import { Globe, Mail } from 'lucide-react';
import { getFooterSettings } from '@/actions';

const Footer = async () => {
  const { data: footerSettings } = await getFooterSettings();
  const whatsappRaw = footerSettings?.whatsapp || '+250788589658';
  const contactEmail = footerSettings?.contactEmail || 'info@airpd.org';
  const whatsappDigits = whatsappRaw.replace(/[^\d]/g, '');
  const whatsappHref = `https://wa.me/${whatsappDigits}`;
  const copyrightText = footerSettings?.copyright;

  return (
    <footer className="text-gray-700 px-4 md:px-8 py-4 md:py-6">
      <div className="w-[98%] mx-auto border-t my-5 pt-5">
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* JAEPH Address Section */}
          <div>
            <h4 className="font-semibold text-lg text-gray-800">
              JAEP Health Sciences Address
            </h4>
            <p className="text-sm mt-2">
              The Journal of African Epidemiology and Public Health Sciences is
              a product of African institute of research for public health and
              development.
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
            <h4 className="font-semibold text-lg text-gray-800">
              About JAEPHS
            </h4>
            <ul className="text-sm mt-2 space-y-1">
              <li>
                <Link href="/manuals#aboutUs" className="hover:text-blue-600">
                  About us
                </Link>
              </li>
              <li>
                <Link href="/manuals#aboutUs" className="hover:text-blue-600">
                  Privacy policy
                </Link>
              </li>
              <li>
                <Link
                  href="/manuals#apcSummary"
                  className="hover:text-blue-600"
                >
                  APC Summary
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
            <ul className="text-sm mt-2 space-y-2">
              <li>
                <a
                  href={`mailto:${contactEmail}`}
                  className="flex items-center gap-2 text-blue-600 hover:underline"
                >
                  <Mail size={18} />
                  <span>Email</span>
                </a>
              </li>
              <li>
                <Link
                  href={whatsappHref}
                  target="_blank"
                  className="flex items-center gap-2 text-blue-600 hover:underline"
                >
                  <span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      fill="#2563EB"
                      viewBox="0 0 24 24"
                    >
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.149-.198.297-.767.966-.94 1.164-.173.198-.347.223-.644.074-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.151-.173.2-.297.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.612-.916-2.209-.242-.58-.487-.501-.669-.51-.173-.007-.372-.009-.571-.009s-.52.074-.793.372c-.272.297-1.04 1.017-1.04 2.479 0 1.461 1.065 2.875 1.213 3.074.149.198 2.099 3.211 5.077 4.376.71.275 1.263.439 1.695.561.712.203 1.36.175 1.872.106.571-.076 1.758-.719 2.008-1.413.25-.695.25-1.289.174-1.413-.076-.124-.273-.198-.57-.347zm-5.421-10.022c-4.991 0-9.051 4.06-9.051 9.051 0 1.57.41 3.108 1.187 4.444l-1.253 4.584 4.708-1.236c1.301.735 2.775 1.134 4.409 1.134 4.991 0 9.051-4.06 9.051-9.051 0-4.991-4.06-9.051-9.051-9.051zm0 16.551c-1.528 0-3.021-.403-4.304-1.163l-.309-.184-2.792.733.746-2.724-.2-.314c-.749-1.17-1.145-2.521-1.145-3.899 0-4.411 3.59-8.001 8.001-8.001 4.411 0 8.001 3.59 8.001 8.001 0 4.411-3.59 8.001-8.001 8.001z" />
                    </svg>
                  </span>
                  <span>WhatsApp Us</span>
                </Link>
              </li>
              <li>
                <Link
                  href="https://www.airpd.org"
                  className="flex items-center gap-2 text-blue-600 hover:underline"
                  target="_blank"
                >
                  <span>
                    <Globe size={18} />
                  </span>
                  <span>Website</span>
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
            Terms and conditions
          </Link>
          ,{' '}
          <Link href="/privacy" className="text-blue-600 hover:underline">
            Privacy statement
          </Link>
          , and{' '}
          <Link href="/cookies" className="text-blue-600 hover:underline">
            Cookies policy
          </Link>
          .
        </div>
        <hr className="mt-6" />
        {/* Bottom Section */}
        <div className="mt-4 flex justify-between items-center text-sm text-gray-600">
          <span>{copyrightText}</span>
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
