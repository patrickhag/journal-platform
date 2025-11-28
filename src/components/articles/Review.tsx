'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { FileList } from '../upload/FileList';
import { useParams, useSearchParams } from 'next/navigation';
import { safeParse } from 'zod-urlsearchparams';
import { filesSchema } from '@/schemas/reviewer';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { DragAndDropFileInput } from '../upload/FileInput';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { reviewerSubmissionSchema, ReviewFormData } from '@/schemas/reviewer';
import { useCreateReview } from '@/hooks/useReviews';
import Loader from '../Loader';
import { useClearURL } from '../ClearURL';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Switch } from '../ui/switch';
import { Input } from '../ui/input';

type AssessmentField = Extract<
  keyof ReviewFormData,
  | 'scopeRelevanceOriginality'
  | 'ethicalCompliance'
  | 'contentQualityRigor'
  | 'dataPresentationInterpretation'
  | 'conclusionsImplications'
  | 'languageQuality'
  | 'referencesFormatting'
  | 'overallScientificQuality'
>;

const assessmentQuestions: {
  name: AssessmentField;
  title: string;
  description: string;
}[] = [
  {
    name: 'scopeRelevanceOriginality',
    title: 'Scope, Relevance, and Originality',
    description:
      'Confirms the manuscript fits the journal scope, addresses a timely topic, and offers original insights.',
  },
  {
    name: 'ethicalCompliance',
    title: 'Ethical Compliance and Research Integrity',
    description:
      'Verifies ethical approvals, consent, conflict disclosures, and overall research integrity.',
  },
  {
    name: 'contentQualityRigor',
    title: 'Content Quality and Scientific Rigor',
    description:
      'Ensures the study design, methods, and presentation support reliable conclusions.',
  },
  {
    name: 'dataPresentationInterpretation',
    title: 'Data Presentation and Interpretation',
    description:
      'Checks that figures, tables, and discussion accurately reflect the results and existing literature.',
  },
  {
    name: 'conclusionsImplications',
    title: 'Conclusions and Implications',
    description:
      'Confirms that conclusions are evidence-based and include realistic implications or recommendations.',
  },
  {
    name: 'languageQuality',
    title: 'Language Quality and Presentation',
    description:
      'Assesses clarity, grammar, and readability for an international academic audience.',
  },
  {
    name: 'referencesFormatting',
    title: 'References and Formatting',
    description:
      'Validates that citations are current, relevant, and formatted per journal guidelines.',
  },
  {
    name: 'overallScientificQuality',
    title: 'Overall Scientific Quality',
    description:
      'Captures your holistic assessment of the manuscript’s fitness for a Scopus-indexed journal.',
  },
];

export default function ReviewModal({
  open,
  onClose,
  articleId,
}: {
  open: boolean;
  onClose: () => void;
  articleId: string;
}) {
  const searchParams = useSearchParams();

  const filesValidation = safeParse({
    schema: filesSchema,
    input: new URLSearchParams(searchParams.toString()),
  });

  const files = filesValidation.data?.files || [];
  const fileIds = files.map((f) => f.publicId);

  const reviewStatus = [
    'Minor Correction',
    'Major Correction',
    'Accepted',
    'Rejected',
  ];

  const form = useForm<ReviewFormData>({
    resolver: zodResolver(reviewerSubmissionSchema),
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: {
      message: '',
      status: undefined,
      scopeRelevanceOriginality: false,
      ethicalCompliance: false,
      contentQualityRigor: false,
      dataPresentationInterpretation: false,
      conclusionsImplications: false,
      languageQuality: false,
      referencesFormatting: false,
      overallScientificQuality: false,
      confidentialComments: '',
      reviewerSignature: '',
    },
  });

  const { assignmentId } = useParams();

  const {
    handleSubmit,
    control,
    formState: { isValid },
  } = form;

  const { mutate: createReviewMutation, isPending } = useCreateReview();

  const clearURL = useClearURL();

  const onSubmit = (data: ReviewFormData) => {
    const payloadData = {
      ...data,
      articleId,
      fileIds,
      reviewAssignmentId: assignmentId as string,
    };

    createReviewMutation(payloadData, {
      onSettled: () => {
        onClose();
        clearURL();
      },
    });
  };

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent side="right" className="sm:max-w-[500px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-2xl font-semibold text-[#1a237e]">
            Write a review
          </SheetTitle>
        </SheetHeader>
        <div className="text-sm">Annotate file(s)</div>
        <DragAndDropFileInput />
        <FileList isEditNeeded={true} />

        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-6">
            <Tabs defaultValue="details" className="space-y-4">
              <TabsList className="grid grid-cols-2 gap-2 bg-muted/60 p-1 rounded-lg">
                <TabsTrigger value="details">Review Details</TabsTrigger>
                <TabsTrigger value="assessment">Review Checklist</TabsTrigger>
              </TabsList>

              <TabsContent value="details" className="space-y-6">
                <p className="text-sm text-muted-foreground">
                  These fields capture the core review details, including your
                  feedback and editorial recommendation.
                </p>
                <FormField
                  control={control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Feedback</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="General feedback on this manuscript?"
                          className="min-h-[120px] resize-none p-4 bg-white rounded-lg"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Status <span className="text-red-700">*</span>
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select article status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {reviewStatus.map((status) => (
                            <SelectItem key={status} value={status}>
                              {status}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>

              <TabsContent value="assessment" className="space-y-6">
                <p className="text-sm text-muted-foreground">
                  Please complete the standardized assessment checklist so
                  editors can track adherence to journal quality benchmarks.
                </p>
                <div className="space-y-5">
                  {assessmentQuestions.map((question) => (
                    <FormField
                      key={question.name}
                      control={control}
                      name={question.name}
                      render={({ field }) => (
                        <FormItem className="rounded-lg border border-border bg-background p-4">
                          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                            <div>
                              <FormLabel className="text-base font-semibold">
                                {question.title}
                              </FormLabel>
                              <p className="text-sm text-muted-foreground">
                                {question.description}
                              </p>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  ))}
                </div>

                <FormField
                  control={control}
                  name="confidentialComments"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confidential comments to the editor</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Share any optional comments for the editor (not visible to the author)."
                          className="min-h-[100px] resize-none p-4 bg-white rounded-lg"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name="reviewerSignature"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Reviewer signature</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Type your name to confirm this assessment."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>
            </Tabs>

            <div className="space-y-3">
              <Button
                type="submit"
                disabled={isPending || !isValid}
                className="bg-indigo-500 hover:bg-indigo-600 w-full"
              >
                {isPending ? <Loader text="Submitting..." /> : 'Submit Review'}
              </Button>
            </div>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
