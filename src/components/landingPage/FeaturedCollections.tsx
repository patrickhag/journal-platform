'use client';

import Link from 'next/link';
import React from 'react';
import { TCollections } from '@/db/schema';
import { Share2 } from 'lucide-react';
import { copyToClipboard } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

export default function FeaturedCollections({
  collection,
}: {
  collection: TCollections;
}) {
  const status = collection.status || 'ACTIVE';
  const deadline = collection.deadline;

  const handleCopy = () => {
    return `${process.env.NEXT_PUBLIC_URL}/collections/${collection.slug}`;
  };

  const getStatusLabel = () => {
    if (status === 'ACTIVE') return 'Open for submissions';
    if (status === 'ARCHIVED') return 'Archived';
    if (status === 'INACTIVE') return 'Closed';
    return 'Open for submissions';
  };

  const formatDeadline = (deadline: Date | string | null | undefined) => {
    if (!deadline) return null;
    try {
      const date = typeof deadline === 'string' ? new Date(deadline) : deadline;
      return date.toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
    } catch {
      return null;
    }
  };

  return (
    <div className="group relative block rounded-lg shadow-md transition-shadow duration-300 overflow-hidden bg-white hover:shadow-sm">
      {/* Title above the image */}
      <div className="p-5 pb-3">
        <p className="text-base font-semibold text-gray-800 mb-2 line-clamp-2">
          {collection.title}
        </p>
      </div>

      {/* Image container */}
      <div className="relative w-full rounded-lg overflow-hidden px-5">
        <Link key={collection.id} href={`/collections/${collection.slug}`}>
          <img
            src={collection.thumbnailUrl as string}
            alt={collection.title}
            className="w-full h-56 md:h-64 object-cover rounded-lg"
          />
        </Link>
        {/* Overlay with SDG + ArrowRight */}
        <div className="absolute bottom-0 left-5 right-5 bg-black rounded-b-lg bg-opacity-50 text-white p-2 flex items-center justify-between">
          <div className="flex items-center justify-between w-full px-3 py-2 text-white">
            <p className="text-sm font-medium truncate">
              SDG: {collection.sdgGoal}
            </p>

            <Share2
              onClick={() => copyToClipboard(handleCopy())}
              className="h-4 w-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200 cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Status and Deadline */}
      <div className="p-5 pt-4 space-y-2">
        <Badge
          variant="outline"
          className={
            status === 'ACTIVE'
              ? 'bg-green-50 text-green-700 border-green-300 font-medium'
              : status === 'ARCHIVED'
                ? 'bg-gray-50 text-gray-700 border-gray-300 font-medium'
                : 'bg-red-50 text-red-700 border-red-300 font-medium'
          }
        >
          {getStatusLabel()}
        </Badge>
        {deadline && (
          <div className="text-sm text-gray-700">
            <span className="font-semibold">Submission deadline:</span>{' '}
            <span className="text-gray-600">{formatDeadline(deadline)}</span>
          </div>
        )}
      </div>
    </div>
  );
}
