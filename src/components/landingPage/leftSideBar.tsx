'use client';

import React, { useEffect, useState } from 'react';
import { ShareIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import {
  Album,
  LinkedinIcon,
  TwitterIcon,
  FacebookIcon,
  Copy,
  ArrowDownToLine,
  Check,
  FileInput,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { handleDownload } from '@/lib/handleDownload';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useGetPublishedVolumes } from '@/hooks/useVolumes';
import { useIncrementMetrics } from '@/hooks/useMetrics';
import { useGetManuals } from '@/hooks/useSettings';

interface LeftSideBarProps {
  isAbstract?: boolean;
  articleFile?: string | null;
  articleId?: string;
}

const LeftSideBar = ({
  isAbstract,
  articleFile,
  articleId,
}: LeftSideBarProps) => {
  const { data: volumes } = useGetPublishedVolumes();
  const [copied, setCopied] = useState(false);
  const [viewCount, setViewCount] = useState(false);
  const { data: manuals } = useGetManuals();

  const handleCopyAPA = async () => {
    try {
      const result = await handleDownload('apa', articleId ?? '');

      if (result?.success) {
        setCopied(true);
        setTimeout(() => {
          setCopied(false);
        }, 2000);
      }
    } catch (error) {
      console.error('Failed to copy APA citation:', error);
    }
  };

  const { mutate: incrementMetrics } = useIncrementMetrics();

  const handleViewArticle = (pdfUrl: string) => {
    window.open(pdfUrl);
    setViewCount(true);
  };

  useEffect(() => {
    if (viewCount) {
      incrementMetrics({ articleId: articleId as string, viewCount });
    }
  }, [viewCount]);

  return (
    <div className="sticky top-0 border-l pl-3">
      <div className="space-y-6 border-gray-200 rounded-lg">
        {/* Important Information Section */}
        <div>
          <h2
            className="text-lg font-semibold text-gray-700"
            style={{ color: '#1A237E' }}
          >
            Important Information
          </h2>
          <ul className="mt-2 space-y-2 text-sm text-gray-600">
            <li>
              <a href="#" className="hover:text-blue-600">
                Editorial board
              </a>
            </li>
            <li>
              <a href="/manuals/#guidelines" className="hover:text-blue-600">
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
          <h2
            className="text-lg font-semibold text-gray-700"
            style={{ color: '#1A237E' }}
          >
            Supplements
          </h2>
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
          <h2
            className="text-lg font-semibold text-gray-700"
            style={{ color: '#1A237E' }}
          >
            Most Accessed
          </h2>
          <ul className="mt-2 space-y-4">
            {[1, 2, 3].map((item) => (
              <li key={item} className="text-sm text-gray-600">
                <a href="#" className="block hover:text-blue-600">
                  Lorem ipsum article has been posted has been posted has been
                  posted
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Reserved for Ads Section */}
        <div>
          <h2
            className="text-lg font-semibold text-gray-700"
            style={{ color: '#1A237E' }}
          >
            Reserved for Ads
          </h2>
          <div className="mt-2">
            <Image
              width={90}
              height={90}
              src="https://res.cloudinary.com/dwhfpxrgz/image/upload/v1732723406/newss_espiuv.png"
              alt="Ad Placeholder"
              className="w-full h-auto border border-gray-300 rounded-md"
            />
          </div>
        </div>

        {/* Archives Section */}
        <div>
          <h2
            className="text-lg font-semibold text-gray-700"
            style={{ color: '#1A237E' }}
          >
            Volumes
          </h2>
          <ul className="mt-2 space-y-2 text-sm text-gray-600">
            {Array.isArray(volumes) && volumes.length > 0 ? (
              volumes.map((vol) => (
                <Link
                  key={vol.id}
                  href={'/articles/issues'}
                  className="hover:text-blue-600"
                >
                  Volume {vol.year} ({vol.issues.length})
                </Link>
              ))
            ) : (
              <p>No volumes found</p>
            )}
          </ul>
        </div>

        {/* Downloads Section */}
        <div>
          <h2
            className="text-lg font-semibold text-gray-700"
            style={{ color: '#1A237E' }}
          >
            Downloads
          </h2>
          <ul className="mt-2 space-y-2 text-sm text-gray-600">
            <li>
              <a
                href={manuals?.copyrightTemplate as string}
                className="hover:text-blue-600"
              >
                Copyright form
              </a>
            </li>
            <li>
              <a
                href={manuals?.paperTemplate as string}
                className="hover:text-blue-600"
              >
                Paper template
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default LeftSideBar;
