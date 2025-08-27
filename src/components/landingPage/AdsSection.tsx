'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useGetHomeAds } from '@/hooks/useAds';

const AdsSection = () => {
  const { data: ads } = useGetHomeAds();
  const [currentAdIndex, setCurrentAdIndex] = useState(0);

  useEffect(() => {
    if (!ads || ads.length === 0) return;
    const interval = setInterval(() => {
      setCurrentAdIndex((prev) => (prev + 1) % ads.length);
    }, 7000);
    return () => clearInterval(interval);
  }, [ads]);

  if (!ads || ads.length === 0) return null;

  const currentAd = ads[currentAdIndex];

  return (
    <div>
      <h2
        className="text-lg font-semibold text-gray-700"
        style={{ color: '#1A237E' }}
      >
        Advertisements
      </h2>
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
  );
};

export default AdsSection;
