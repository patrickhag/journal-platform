'use client';

import { useState } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import { ChevronDown, ChevronRight } from 'lucide-react';

type Volume = {
  id: string;
  volumeNumber: number;
  year: number;
  issues: {
    id: string;
    issueNumber: number;
    publicationDate: string | null;
    articles: {
      id: string;
    }[];
  }[];
};

type IssuesList = {
  volume: Volume;
};

export function IssuesList({ volume }: IssuesList) {
  const [expandedVolume, setExpandedVolume] = useState<number | null>(null);

  return (
    <div className="space-y-4">
      <div key={volume.year} className="border-b border-gray-100 pb-4">
        <button
          type="button"
          className="w-full flex items-center justify-between text-left p-2 hover:bg-gray-50 rounded"
          aria-expanded={expandedVolume === volume.year}
          onClick={() =>
            setExpandedVolume((current) =>
              current === volume.year ? null : volume.year
            )
          }
        >
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Volume {volume.volumeNumber} ({volume.year})
            </h3>
            <p className="text-sm text-gray-500">
              {volume.issues.length === 0
                ? 'No issues in this volume'
                : `${volume.issues.length} issue${volume.issues.length > 1 ? 's' : ''} in this volume`}
            </p>
          </div>
          <span className="ml-4 text-gray-400">
            {expandedVolume === volume.year ? (
              <ChevronDown className="h-5 w-5" aria-hidden="true" />
            ) : (
              <ChevronRight className="h-5 w-5" aria-hidden="true" />
            )}
          </span>
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
                    {issue.publicationDate
                      ? format(new Date(issue.publicationDate), 'MMMM')
                      : 'Unscheduled'}
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
    </div>
  );
}
