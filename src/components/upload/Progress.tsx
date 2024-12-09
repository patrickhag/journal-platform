'use client';
import { Check } from 'lucide-react';
import { usePathname } from 'next/navigation';
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

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
    <div className="sticky top-14 max-w-5xl mx-auto mb-3">
      <Card>
        <div className="flex items-center space-x-4 m-3">
          {journalKeys.map(({ page: j, title }, i) => (
            <React.Fragment key={j}>
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full ${
                  i < journalKeys.map((k) => k.page).indexOf(page ?? 'start')
                    ? 'bg-indigo-500'
                    : 'bg-indigo-300'
                } text-white`}
              >
                {i < journalKeys.map((k) => k.page).indexOf(page ?? '') ? (
                  <Check size={15} />
                ) : (
                  i + 1
                )}
              </div>
              <div className="text-[#626EEF]">{title}</div>
              {i < journalKeys.length - 1 && (
                <div className="h-px w-14 bg-[#838F9A] flex-1" />
              )}
            </React.Fragment>
          ))}
        </div>
      </Card>
    </div>
  );
};
