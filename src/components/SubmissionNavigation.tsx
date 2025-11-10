'use client';

import { forwardRef } from 'react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Loader from '@/components/Loader';

type SubmissionNavigationProps = {
  onBack: () => void;
  onNext: () => void;
  isBackDisabled?: boolean;
  nextLabel?: string;
  backLabel?: string;
  className?: string;
  nextType?: 'button' | 'submit';
  isNextDisabled?: boolean;
  isNextLoading?: boolean;
};

export const SubmissionNavigation = forwardRef<
  HTMLDivElement,
  SubmissionNavigationProps
>(
  (
    {
      onBack,
      onNext,
      isBackDisabled,
      nextLabel = 'Next',
      backLabel = 'Back',
      className,
      nextType = 'button',
      isNextDisabled = false,
      isNextLoading = false,
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          'flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between',
          className
        )}
      >
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          disabled={isBackDisabled}
        >
          {backLabel}
        </Button>
        <Button
          type={nextType}
          onClick={nextType === 'submit' ? undefined : onNext}
          disabled={isNextDisabled || isNextLoading}
        >
          {isNextLoading ? <Loader text="Submitting..." /> : nextLabel}
        </Button>
      </div>
    );
  }
);

SubmissionNavigation.displayName = 'SubmissionNavigation';
