'use client';

import { useGetPublishedVolumes } from '@/hooks/useVolumes';
import { format } from 'date-fns';
import { ChevronDown, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

function IssuesListSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className="border-b border-gray-100 pb-4">
          <div className="w-full flex items-center justify-between text-left p-2">
            <div className="flex-1">
              <Skeleton className="h-6 w-48 mb-2" />
              <Skeleton className="h-4 w-40" />
            </div>
            <Skeleton className="h-5 w-5 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function IssuesList() {
  const [expandedVolume, setExpandedVolume] = useState<number | null>(null);

  const { data: volumes, isPending } = useGetPublishedVolumes();

  const toggleVolume = (year: number) => {
    setExpandedVolume(expandedVolume === year ? null : year);
  };

  if (isPending) {
    return <IssuesListSkeleton />;
  }

  return (
    <div className="space-y-4">
      {volumes?.map((volume) => (
        <div key={volume.year} className="border-b border-gray-100 pb-4">
          <button
            onClick={() => toggleVolume(volume.year)}
            className="w-full flex items-center justify-between text-left p-2 hover:bg-gray-50 rounded"
          >
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Volume {volume.volumeNumber} ({volume.year})
              </h3>
              <p className="text-sm text-gray-500">
                {volume.issues.length} issues in this volume
              </p>
            </div>
            {expandedVolume === volume.year ? (
              <ChevronDown className="h-5 w-5 text-gray-400" />
            ) : (
              <ChevronRight className="h-5 w-5 text-gray-400" />
            )}
          </button>

          {expandedVolume === volume.year && (
            <div className="mt-2 space-y-2 pl-4">
              {volume.issues.map((issue) => (
                <Link
                  key={issue.id}
                  href={`/articles/issues/${issue.id}`}
                  className="block p-2 hover:bg-gray-50 rounded text-blue-900"
                >
                  <div className="flex justify-between items-center">
                    <span>
                      Issue {issue.issueNumber} •{' '}
                      {format(new Date(issue.publicationDate), 'MMMM')}
                    </span>
                    <span className="text-sm text-gray-500">
                      {issue.articles.length} articles
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
