'use client';

import React from 'react';
import { EyeIcon, ShareIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import { Album, LinkedinIcon, TwitterIcon, FacebookIcon } from 'lucide-react';
import { DownloadIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { handleDownload } from '@/lib/handleDownload';
import { downloadFile } from '@/lib/downloadFile';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface LeftSideBarProps {
  isAbstract?: boolean;
  articleFiles?: {
    publicId: string | null;
    fileType: string | null;
  }[];
  articleId: string;
}

const LeftSideBar = ({
  isAbstract,
  articleFiles,
  articleId,
}: LeftSideBarProps) => {
  const articleFile = articleFiles?.filter(
    (file) => file.fileType === 'Article Text'
  );

  return (
    <div className="sticky top-0">
      {/* Download, Cite and Share */}
      {isAbstract && (
        <div className="flex flex-col gap-2 mb-5">
          {articleFile?.map((file) => (
            <div key={file.publicId}>
              <Link href={`${file.publicId}`}>
                <Button className="w-full" variant="outline">
                  <span className="flex items-center gap-2">
                    <DownloadIcon className="w-4 h-4" /> Download this article
                  </span>
                </Button>
              </Link>
            </div>
          ))}
          <div className="flex justify-between gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline">
                  <span className="flex items-center gap-2">
                    <Album className="w-4 h-4" /> Cite this article
                  </span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <h4 className="font-medium leading-none">
                      Download citations
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Download citations in different formats.
                    </p>
                  </div>
                  <Button
                    variant={'secondary'}
                    onClick={async () => {
                      const result = await handleDownload('bibtex', articleId);
                      if (result?.success) {
                        downloadFile(result.content, result.filename);
                      }
                    }}
                  >
                    BibTeX format
                  </Button>
                  <Button
                    variant={'secondary'}
                    onClick={async () => {
                      const result = await handleDownload('ris', articleId);
                      if (result?.success) {
                        downloadFile(result.content, result.filename);
                      }
                    }}
                  >
                    RIS format
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <span className="flex items-center gap-2">
                    <ShareIcon className="w-4 h-4" /> Share this article
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuSeparator />
                <DropdownMenuRadioGroup>
                  <DropdownMenuRadioItem
                    value="facebook"
                    onClick={() => {
                      window.open(
                        `https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`,
                        '_blank'
                      );
                    }}
                  >
                    <FacebookIcon className="w-4 h-4 text-blue-500 mr-2" />
                    <span>Facebook</span>
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem
                    value="twitter"
                    onClick={() => {
                      window.open(
                        `https://twitter.com/intent/tweet?url=${window.location.href}`,
                        '_blank'
                      );
                    }}
                  >
                    <TwitterIcon className="w-4 h-4 text-blue-500 mr-2  " />
                    <span>Twitter</span>
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem
                    value="linkedin"
                    onClick={() => {
                      window.open(
                        `https://www.linkedin.com/shareArticle?url=${window.location.href}`,
                        '_blank'
                      );
                    }}
                  >
                    <LinkedinIcon className="w-4 h-4 text-blue-500 mr-2" />
                    <span>Linkedin</span>
                  </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      )}
      <div className="bg-gray-50 p-4 space-y-6 border-r border-gray-200 rounded-lg">
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
              <a href="#" className="hover:text-blue-600">
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
            Archives
          </h2>
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
          <h2
            className="text-lg font-semibold text-gray-700"
            style={{ color: '#1A237E' }}
          >
            Downloads
          </h2>
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
    </div>
  );
};

export default LeftSideBar;
