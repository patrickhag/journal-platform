'use client';

import {
  type ComponentType,
  useMemo,
  useState,
  useEffect,
  useRef,
} from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, Path, useForm } from 'react-hook-form';

import {
  StepArticleDetails,
  StepAttachFiles,
  StepMetadata,
  StepReviewers,
  StepFinalInfo,
} from './components';
import { manuscriptFormSchema, type ManuscriptFormValues } from './schema';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { useSubmitManuscript } from '@/hooks/useSubmitManuscript';
import { toast } from 'sonner';
import { SubmissionNavigation } from '@/components/SubmissionNavigation';

type StepConfig = {
  id: string;
  title: string;
  fields: Path<ManuscriptFormValues>[];
  progressId: string;
  Component: ComponentType;
};

const steps: StepConfig[] = [
  {
    id: 'article-details',
    title: 'Article details',
    fields: ['sectionType', 'submissionRequirements'],
    progressId: 'start',
    Component: StepArticleDetails,
  },
  {
    id: 'attach-files',
    title: 'Attach files',
    fields: ['files'],
    progressId: 'attach-files',
    Component: StepAttachFiles,
  },
  {
    id: 'metadata',
    title: 'Metadata',
    fields: [
      'metadata.title',
      'metadata.prefix',
      'metadata.subtitle',
      'metadata.abstract',
      'metadata.topics',
      'contributors',
    ],
    progressId: 'meta',
    Component: StepMetadata,
  },
  {
    id: 'reviewers',
    title: 'Reviewers',
    fields: ['reviewers', 'reviewers.0.names'],
    progressId: 'reviewer',
    Component: StepReviewers,
  },
  {
    id: 'final',
    title: 'Additional info',
    fields: [
      'finalSubmission.funded',
      'finalSubmission.ethical',
      'finalSubmission.consent',
      'finalSubmission.human',
    ],
    progressId: 'final',
    Component: StepFinalInfo,
  },
];

const defaultValues: ManuscriptFormValues = {
  sectionType: '',
  submissionRequirements: [],
  editorComments: '',
  files: [],
  metadata: {
    title: '',
    prefix: '',
    subtitle: '',
    abstract: '',
    topics: [],
  },
  contributors: [],
  reviewers: [],
  finalSubmission: {
    funded: 'no',
    ethical: 'no',
    consent: 'no',
    human: 'no',
    founders: '',
    ethicalReference: '',
  },
};

export default function Page() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const rawCurrentStepParam = searchParams.get('currentStep');
  const { stepIndexFromQuery, completedFromQuery } = useMemo(() => {
    const queryIndex = rawCurrentStepParam
      ? steps.findIndex((step) => step.progressId === rawCurrentStepParam)
      : -1;
    const parsedCompleted =
      searchParams
        .get('completedSteps')
        ?.split(',')
        .map((value) => value.trim())
        .filter(Boolean) ?? [];

    return {
      stepIndexFromQuery: queryIndex >= 0 ? queryIndex : 0,
      completedFromQuery: parsedCompleted,
    };
  }, [searchParams]);

  const [currentStep, setCurrentStep] = useState(stepIndexFromQuery);
  const [completedStepIds, setCompletedStepIds] =
    useState<string[]>(completedFromQuery);
  const [isInitialized, setIsInitialized] = useState(false);
  const isInternalNavigation = useRef(false);

  const formMethods = useForm<ManuscriptFormValues>({
    resolver: zodResolver(manuscriptFormSchema),
    defaultValues,
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    shouldUnregister: false,
  });

  const { handleSubmit, trigger } = formMethods;
  const { mutateAsync: submitManuscript, isPending } = useSubmitManuscript();

  const isLastStep = currentStep === steps.length - 1;
  const { Component, progressId: currentProgressId } = steps[currentStep];

  const markStepCompleted = (stepId: string) => {
    setCompletedStepIds((prev) =>
      prev.includes(stepId) ? prev : [...prev, stepId]
    );
  };

  useEffect(() => {
    if (!router || !pathname || !isInitialized) return;

    if (currentStep === 0 && completedStepIds.length === 0) {
      if (
        searchParams.has('currentStep') ||
        searchParams.has('completedSteps')
      ) {
        router.replace(pathname, { scroll: false });
      }
      return;
    }

    const params = new URLSearchParams(searchParams.toString());
    params.set('currentStep', steps[currentStep].progressId);

    if (completedStepIds.length > 0) {
      params.set(
        'completedSteps',
        Array.from(new Set(completedStepIds)).join(',')
      );
    } else {
      params.delete('completedSteps');
    }

    const nextQuery = params.toString();
    const currentQuery = searchParams.toString();

    if (nextQuery === currentQuery) return;

    const nextUrl = nextQuery ? `${pathname}?${nextQuery}` : pathname;
    router.replace(nextUrl, { scroll: false });
  }, [
    completedStepIds,
    currentStep,
    isInitialized,
    pathname,
    router,
    searchParams,
  ]);

  const goToStep = (step: number) => {
    isInternalNavigation.current = true;
    setCurrentStep(step);
  };

  useEffect(() => {
    const targetIndex = stepIndexFromQuery;
    if (isInternalNavigation.current) {
      if (currentStep === targetIndex) {
        isInternalNavigation.current = false;
      }
      setIsInitialized(true);
      return;
    }

    if (currentStep !== targetIndex) {
      setCurrentStep(targetIndex);
    }
    setIsInitialized(true);
  }, [currentStep, stepIndexFromQuery]);

  const goToNextStep = async () => {
    const fields = steps[currentStep].fields;
    const isStepValid = await trigger(fields, { shouldFocus: true });

    if (!isStepValid) {
      toast.info(
        'Check your fields you might have forgotten to fill a required field.'
      );
      return;
    }

    if (isLastStep) {
      await handleSubmit(onSubmit)();
      return;
    }

    markStepCompleted(currentProgressId);
    goToStep(currentStep + 1);
  };

  const goToPreviousStep = () => {
    if (currentStep === 0) return;
    goToStep(currentStep - 1);
  };

  const onSubmit = async (values: ManuscriptFormValues) => {
    if (!isLastStep) {
      markStepCompleted(currentProgressId);
      goToStep(currentStep + 1);
      return;
    }

    try {
      await submitManuscript(values);
    } catch (error) {
      console.error('Failed to submit manuscript', error);
    }
  };

  return (
    <FormProvider {...formMethods}>
      <form className="space-y-8" onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <CardContent className="p-6 space-y-8">
            <Component key={steps[currentStep].id} />

            <SubmissionNavigation
              onBack={goToPreviousStep}
              onNext={goToNextStep}
              isBackDisabled={currentStep === 0}
              nextLabel={isLastStep ? 'Submit Manuscript' : 'Next'}
              isNextDisabled={isLastStep && isPending}
              isNextLoading={isLastStep && isPending}
            />

            <p className="text-sm text-muted-foreground">
              <span className="text-red-500">*</span> Denotes a required field
            </p>
          </CardContent>
        </Card>
      </form>
    </FormProvider>
  );
}
