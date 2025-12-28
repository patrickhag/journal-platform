'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import React, { useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

const journalKeys = [
  { id: 'start', page: 'start', title: 'Start' },
  { id: 'attach-files', page: 'attach-files', title: 'Attach files' },
  { id: 'meta', page: 'meta', title: 'Meta data' },
  { id: 'reviewer', page: 'reviewer', title: 'Reviewers' },
  { id: 'final', page: 'final', title: 'Final submit' },
];

export const ProgressLine = () => {
  const pathname = usePathname();
  const params = useSearchParams();
  const pageSegment = pathname.split('/').at(-1) ?? 'start';
  const isNewManuscriptFlow = pageSegment === 'new-manuscript';

  const wizardCurrentStepParam = params.get('currentStep');
  const wizardCurrentStepId = journalKeys.some(
    (key) => key.id === wizardCurrentStepParam
  )
    ? (wizardCurrentStepParam as string)
    : journalKeys[0].id;
  const rawCompleted = useMemo(() => params.get('completedSteps'), [params]);
  const completedWizardSteps = useMemo(() => {
    if (!rawCompleted) return new Set<string>();
    const validIds = rawCompleted
      .split(',')
      .map((value) => value.trim())
      .filter((value) => journalKeys.some((key) => key.id === value));
    return new Set(validIds);
  }, [rawCompleted]);

  const defaultCurrentIndex = useMemo(() => {
    const normalizedPage =
      pageSegment === 'new-manuscript' ? 'start' : pageSegment;
    const foundIndex = journalKeys.findIndex(
      (key) => key.page === normalizedPage
    );
    return foundIndex === -1 ? 0 : foundIndex;
  }, [pageSegment]);

  return (
    <div className="sticky top-16 z-30">
      <div className="max-w-5xl mx-auto">
        <Card>
          <div className="flex items-center justify-between m-3 gap-0 sm:gap-2 md:gap-4">
            {journalKeys.map(({ id, title }, index) => {
              const isCompleted = isNewManuscriptFlow
                ? completedWizardSteps.has(id)
                : index < defaultCurrentIndex;
              const isCurrent = isNewManuscriptFlow
                ? !isCompleted && wizardCurrentStepId === id
                : index === defaultCurrentIndex;
              const isLast = index === journalKeys.length - 1;

              return (
                <React.Fragment key={id}>
                  <div className="flex items-center flex-auto">
                    <div className="flex items-center lg:flex-row gap-2">
                      <div
                        className={cn(
                          'flex h-6 w-6 md:h-8 md:w-8 items-center justify-center rounded-full text-white text-xs md:text-base transition-all duration-300',
                          isCompleted ? 'bg-brand' : 'bg-brand/40',
                          isCurrent ? 'ring-2 ring-offset-2 ring-brand' : '',
                          isLast ? 'mr-auto' : ''
                        )}
                      >
                        {isCompleted ? (
                          <Check className="w-3 h-3 md:w-4 md:h-4" />
                        ) : (
                          index + 1
                        )}
                      </div>
                      <span
                        className={cn(
                          'text-brand text-[.5rem] md:text-[0.8rem] hidden sm:block',
                          isCurrent ? 'font-medium' : ''
                        )}
                      >
                        {title}
                      </span>
                    </div>
                    {index < journalKeys.length - 1 && (
                      <div className="h-px bg-borderPlatform flex-1 mx-2 min-w-[10px] lg:min-w-[20px]" />
                    )}
                  </div>
                </React.Fragment>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
};
