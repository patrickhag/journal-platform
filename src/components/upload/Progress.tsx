'use client';
import { Check } from 'lucide-react';
import { usePathname } from 'next/navigation';
import React from 'react';
const journalKeys = [
  { page: 'start', title: 'Start' },
  { page: 'attach-files', title: 'Attach files' },
  { page: 'meta', title: 'Enter meta data' },
  { page: 'reviewer', title: 'Reviewers' },
  { page: 'final', title: 'Final submit' },
];
export const ProgressLine = () => {
  const pathname = usePathname();
  const page = pathname.split('/').at(-1);

  return (
    <div className="mb-8 sticky top-16 w-full">
      <div className="flex items-center space-x-4 bg-gray-100">
        {journalKeys.map(({ page: j, title }, i) => (
          <React.Fragment key={j}>
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full ${
                i < journalKeys.map((k) => k.page).indexOf(page ?? 'start')
                  ? 'bg-blue-600'
                  : 'bg-blue-200'
              } text-white`}
            >
              {i < journalKeys.map((k) => k.page).indexOf(page ?? '') ? (
                <Check size={15} />
              ) : (
                i + 1
              )}
            </div>
            <div className="text-blue-600">{title}</div>
            {i < journalKeys.length - 1 && (
              <div className="h-px w-14 bg-[#838F9A] flex-1" />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};
