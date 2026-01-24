'use client';

import { useEffect, useState } from 'react';
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
  const [isExpanded, setIsExpanded] = useState(false);
  const [issuePage, setIssuePage] = useState(1);
  const issuesPerPage = 5;
  const totalPages = Math.max(
    1,
    Math.ceil(volume.issues.length / issuesPerPage)
  );
  const paginatedIssues = volume.issues.slice(
    (issuePage - 1) * issuesPerPage,
    issuePage * issuesPerPage
  );

  useEffect(() => {
    setIssuePage(1);
  }, [volume.id]);

  useEffect(() => {
    if (issuePage > totalPages) {
      setIssuePage(totalPages);
    }
  }, [issuePage, totalPages]);

  return (
    <div className="space-y-4">
      <div key={volume.year} className="border-b border-gray-100 pb-4">
        <button
          type="button"
          className="w-full flex items-center justify-between text-left p-2 hover:bg-gray-50 rounded"
          aria-expanded={isExpanded}
          onClick={() => {
            setIsExpanded((current) => !current);
            if (!isExpanded) {
              setIssuePage(1);
            }
          }}
        >
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Volume {volume.year}
            </h3>
            <p className="text-sm text-gray-500">
              {volume.issues.length === 0
                ? 'No issues in this volume'
                : `${volume.issues.length} issue${volume.issues.length > 1 ? 's' : ''} in this volume`}
            </p>
          </div>
          <span className="ml-4 text-gray-400">
            {isExpanded ? (
              <ChevronDown className="h-5 w-5" aria-hidden="true" />
            ) : (
              <ChevronRight className="h-5 w-5" aria-hidden="true" />
            )}
          </span>
        </button>

        {isExpanded && (
          <div className="mt-2 space-y-2 pl-4">
            {paginatedIssues.map((issue) => (
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
            {volume.issues.length > issuesPerPage && (
              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  className="px-3 py-1 text-sm font-medium text-gray-700 border border-gray-200 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={() => setIssuePage((current) => current - 1)}
                  disabled={issuePage === 1}
                >
                  Previous
                </button>
                <span className="text-sm text-gray-500">
                  Page {issuePage} of {totalPages}
                </span>
                <button
                  type="button"
                  className="px-3 py-1 text-sm font-medium text-gray-700 border border-gray-200 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={() => setIssuePage((current) => current + 1)}
                  disabled={issuePage === totalPages}
                >
                  Next
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
