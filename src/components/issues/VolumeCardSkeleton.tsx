import React from 'react';

const VolumeCardSkeleton = () => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm animate-pulse">
      {/* Header with title and menu */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          {/* Volume title skeleton */}
          <div className="h-7 bg-gray-200 rounded w-24"></div>
          {/* Status badge skeleton */}
          <div className="h-6 bg-gray-200 rounded-full w-16"></div>
        </div>
        {/* Menu dots skeleton */}
        <div className="h-6 w-6 bg-gray-200 rounded"></div>
      </div>

      {/* Volume subtitle */}
      <div className="h-5 bg-gray-200 rounded w-20 mb-2"></div>

      {/* Year */}
      <div className="h-5 bg-gray-200 rounded w-24 mb-6"></div>

      {/* Related Issues section */}
      <div className="flex items-center justify-between mb-4">
        <div className="h-6 bg-gray-200 rounded w-28"></div>
        <div className="h-5 bg-gray-200 rounded w-16"></div>
      </div>

      {/* Divider */}
      <div className="h-px bg-gray-200 mb-4"></div>

      {/* Issue items */}
      <div className="space-y-4">
        {/* Issue 1 */}
        <div className="flex items-start gap-3">
          {/* Issue icon */}
          <div className="h-8 w-8 bg-gray-200 rounded mt-1"></div>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              {/* Issue title */}
              <div className="h-6 bg-gray-200 rounded w-16"></div>
              {/* Status badge */}
              <div className="h-6 bg-gray-200 rounded-full w-12"></div>
            </div>
            {/* Issue description */}
            <div className="h-4 bg-gray-200 rounded w-32"></div>
          </div>
        </div>

        {/* Issue 2 */}
        <div className="flex items-start gap-3">
          {/* Issue icon */}
          <div className="h-8 w-8 bg-gray-200 rounded mt-1"></div>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              {/* Issue title */}
              <div className="h-6 bg-gray-200 rounded w-16"></div>
              {/* Status badge */}
              <div className="h-6 bg-gray-200 rounded-full w-12"></div>
            </div>
            {/* Issue description */}
            <div className="h-4 bg-gray-200 rounded w-40"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VolumeCardSkeleton;
