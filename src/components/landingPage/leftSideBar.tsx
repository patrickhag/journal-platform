'use client';

import Link from 'next/link';
import { useGetPublishedVolumes } from '@/hooks/useVolumes';
import { useGetManuals } from '@/hooks/useSettings';
import { useGetMostViewed } from '@/hooks/useMetrics';
import { useEffect, useState } from 'react';
import { useGetHomeAds } from '@/hooks/useAds';

const ads = [
  {
    id: '1',
    title: 'Research Conference 2024',
    imageUrl:
      'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400',
    linkUrl: 'https://conference2024.example.com',
    startDate: new Date('2024-01-01'),
    endDate: new Date('2024-12-31'),
    isActive: true,
    createdAt: new Date('2024-01-01'),
  },
  {
    id: '2',
    title: 'Academic Writing Workshop',
    imageUrl:
      'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400',
    linkUrl: 'https://workshop.example.com',
    startDate: new Date('2024-06-01'),
    endDate: new Date('2024-08-31'),
    isActive: true,
    createdAt: new Date('2024-05-15'),
  },
  {
    id: '3',
    title: 'Research Methods Seminar',
    imageUrl:
      'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=400',
    linkUrl: 'https://seminar.example.com',
    startDate: new Date('2024-09-10'),
    endDate: new Date('2024-11-20'),
    isActive: true,
    createdAt: new Date('2024-08-01'),
  },
];

const LeftSideBar = () => {
  const { data: volumes } = useGetPublishedVolumes();
  const { data: manuals } = useGetManuals();
  const { data: mostViewed } = useGetMostViewed();
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const { data: ads } = useGetHomeAds();

  useEffect(() => {
    if (!ads || ads.length === 0) return;
    const interval = setInterval(() => {
      setCurrentAdIndex((prevIndex: number) => (prevIndex + 1) % ads.length);
    }, 7000);
    return () => clearInterval(interval);
  }, []);

  if (!ads || ads.length === 0) {
    return null;
  }

  const currentAd = ads[currentAdIndex];

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
              <Link href="/editorial-board" className="hover:text-blue-600">
                Editorial board
              </Link>
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
              <Link href="/collections" className="hover:text-blue-600">
                Collections
              </Link>
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
            {mostViewed?.map((item) => (
              <li key={item.id} className="text-sm text-gray-600">
                <Link
                  href={item.publishedArticle.slug}
                  className="block hover:text-blue-600"
                >
                  {item.publishedArticle.article.metadata.title}
                </Link>
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
            Advertisements
          </h2>

          {/* Archives Section */}
          <div className="relative w-full border border-gray-300 rounded-md overflow-hidden mt-2">
            <Link
              href={currentAd.linkUrl}
              target="_blank"
              rel="noopener noreferrer"
              title={currentAd.title}
            >
              <img
                src={currentAd.imageUrl}
                alt={currentAd.title}
                width={400}
                height={200}
                className="w-full h-40 object-cover transition duration-300 ease-in-out"
              />
            </Link>
            <div className="absolute bottom-0 w-full bg-black bg-opacity-50 text-white text-xs p-2">
              {currentAd.title}
            </div>
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
