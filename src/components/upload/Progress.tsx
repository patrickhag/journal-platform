'use client';
import { Check } from 'lucide-react';
import { usePathname } from 'next/navigation';
import React from 'react';
import { Card } from '@/components/ui/card';

const journalKeys = [
  { page: 'start', title: 'Start' },
  { page: 'attach-files', title: 'Attach files' },
  { page: 'meta', title: 'Enter meta data' },
  { page: 'reviewer', title: 'Reviewers' },
  { page: 'final', title: 'Final submit' },
];

export const ProgressLine = () => {
  const pathname = usePathname();
  const page = pathname.split('/').at(-1) ?? 'start';
  const currentStepIndex = journalKeys.findIndex((k) => k.page === page);

  return (
    <div className="sticky top-14 container sm:w-full md:w-10/12 mx-auto mb-3 z-50">
      <Card>
        <div className="flex items-center justify-between m-3 gap-0 sm:gap-2 md:gap-4">
          {journalKeys.map(({ page: j, title }, i) => {
            const isCompleted = i < currentStepIndex;
            const isCurrent = i === currentStepIndex;
            const isLast = i === journalKeys.length - 1;

            return (
              <React.Fragment key={j}>
                <div className="flex items-center flex-auto">
                  {/* Step circle and title */}
                  <div className="flex items-center lg:flex-row gap-2">
                    <div
                      className={`flex h-6 w-6 md:h-8 md:w-8 items-center justify-center rounded-full ${
                        isCompleted ? 'bg-indigo-500' : 'bg-indigo-300'
                      } text-white text-xs md:text-base transition-all duration-300 ${
                        isLast ? 'mr-auto' : ''
                      }`}
                    >
                      {isCompleted ? (
                        <Check className="w-3 h-3 md:w-4 md:h-4" />
                      ) : (
                        i + 1
                      )}
                    </div>
                    {/* Title (hidden on mobile) */}
                    <span
                      className={`text-[#626EEF] text-[.5rem] md:text-[0.8rem] ${
                        isCurrent ? 'font-medium' : ''
                      } hidden sm:block`}
                    >
                      {title}
                    </span>
                  </div>

                  {/* Connector line (between steps) */}
                  {i < journalKeys.length - 1 && (
                    <div className="h-px bg-[#838F9A] flex-1 mx-2 min-w-[10px] lg:min-w-[20px]" />
                  )}
                </div>
              </React.Fragment>
            );
          })}
        </div>
      </Card>
    </div>
  );
};
