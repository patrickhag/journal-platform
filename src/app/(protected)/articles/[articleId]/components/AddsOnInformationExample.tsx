'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, XCircle } from 'lucide-react';
import { useGetFinalSubmissions } from '@/hooks/useArticles';
import { useParams } from 'next/navigation';
import withPermissions from '@/components/WithPermission';
import { FinalSubmissionSkeleton } from '@/components/skeletons/FinalQuestionsSkeleton';

function FinalSubmissionCard() {
  const { articleId } = useParams();
  const { data: submission, isPending } = useGetFinalSubmissions(
    articleId as string
  );

  const renderQuestion = (question: string, value: boolean) => (
    <div className="flex items-center justify-between py-2 border-b last:border-0">
      <p className="text-sm font-medium">{question}</p>
      {value ? (
        <Badge
          variant="outline"
          className="flex items-center gap-1 text-green-700 border-green-300"
        >
          <CheckCircle2 className="h-4 w-4" /> Yes
        </Badge>
      ) : (
        <Badge
          variant="outline"
          className="flex items-center gap-1 text-red-700 border-red-300"
        >
          <XCircle className="h-4 w-4" /> No
        </Badge>
      )}
    </div>
  );

  if (isPending) {
    return <FinalSubmissionSkeleton />;
  }

  if (!submission) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-[#1a237e]">
            Final Submission Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            No submission data found.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-[#1a237e]">
          Final Questions
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {renderQuestion('Was this study funded?', submission.funded)}
        {renderQuestion(
          'Was this study given an ethical clearance?',
          submission.ethical
        )}
        {renderQuestion(
          'Has this study provided informed consent?',
          submission.consent
        )}
        {renderQuestion(
          'Has this study included human parts or samples?',
          submission.human
        )}

        {submission.founders && (
          <div className="pt-3">
            <p className="text-sm text-muted-foreground">
              Funding Organization
            </p>
            <p className="font-medium">{submission.founders}</p>
          </div>
        )}

        {submission.ethicalReference && (
          <div className="pt-2">
            <p className="text-sm text-muted-foreground">
              Ethical Reference Number
            </p>
            <p className="font-medium">{submission.ethicalReference}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export const FinalSubmissionCardWithPermissions =
  withPermissions(FinalSubmissionCard);
