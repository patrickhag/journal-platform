'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useGetHomeAds } from '@/hooks/useAds';

const AdsSection = () => {
  const { data: ads } = useGetHomeAds();
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    if (!ads || ads.length === 0) return;
    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentAdIndex((prev) => (prev + 1) % ads.length);
        setIsTransitioning(false);
      }, 300);
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
      <div className="relative w-full border border-gray-300 rounded-md overflow-hidden mt-2 h-64">
        <Link
          href={currentAd.linkUrl}
          target="_blank"
          rel="noopener noreferrer"
          title={currentAd.title}
          className="block h-full"
        >
          <div
            className={`relative w-full h-full transition-opacity duration-500 ease-in-out ${
              isTransitioning ? 'opacity-0' : 'opacity-100'
            }`}
          >
            <img
              src={currentAd.imageUrl}
              alt={currentAd.title}
              width={400}
              height={288}
              className="w-full h-full object-cover"
            />
          </div>
        </Link>
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/60 to-transparent text-white p-3">
          <p className="text-sm font-medium">{currentAd.title}</p>
        </div>
      </div>
    </div>
  );
};

export default AdsSection;
