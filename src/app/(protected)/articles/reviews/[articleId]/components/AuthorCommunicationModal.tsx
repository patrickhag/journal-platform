'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, Send } from 'lucide-react';
import { toast } from 'sonner';

interface Review {
  id: string;
  reviewerName: string;
  recommendation:
    | 'accept'
    | 'minor_revision'
    | 'major_revision'
    | 'reject'
    | null;
  rating: number | null;
}

interface Manuscript {
  id: string;
  title: string;
  authors: string[];
}

interface AuthorCommunicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  manuscript: Manuscript;
  reviews: Review[];
}

export const AuthorCommunicationModal = ({
  isOpen,
  onClose,
  manuscript,
  reviews,
}: AuthorCommunicationModalProps) => {
  const [decision, setDecision] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const getDecisionTemplates = () => ({
    minor_revision: `Dear Authors,

Thank you for submitting your manuscript "${manuscript?.title}" to our journal. After careful review by our expert reviewers, we are pleased to inform you that your paper has been conditionally accepted pending minor revisions.

The reviewers have provided valuable feedback that will strengthen your manuscript. Please address the following points:

[REVIEWER_COMMENTS]

We look forward to receiving your revised manuscript within 30 days. Please submit a detailed response letter explaining how you have addressed each reviewer comment.

Best regards,
[EDITOR_NAME]`,

    major_revision: `Dear Authors,

Thank you for submitting your manuscript "${manuscript?.title}" to our journal. After thorough review, we believe your work has merit but requires major revisions before it can be considered for publication.

The reviewers have identified several significant issues that need to be addressed:

[REVIEWER_COMMENTS]

We encourage you to revise and resubmit your manuscript within 60 days. Please provide a comprehensive response letter detailing how you have addressed each concern.

Best regards,
[EDITOR_NAME]`,

    accept: `Dear Authors,

Congratulations! We are pleased to accept your manuscript "${manuscript?.title}" for publication in our journal.

The reviewers were impressed with the quality of your work and found it to be a valuable contribution to the field.

[REVIEWER_COMMENTS]

We will now proceed with the production process. You can expect to receive proofs within 2-3 weeks.

Best regards,
[EDITOR_NAME]`,

    reject: `Dear Authors,

Thank you for submitting your manuscript "${manuscript?.title}" to our journal. After careful consideration by our reviewers, we regret to inform you that we cannot accept your manuscript for publication.

The reviewers have provided detailed feedback:

[REVIEWER_COMMENTS]

We encourage you to consider the reviewers' comments for future submissions to other journals.

Best regards,
[EDITOR_NAME]`,
  });

  const getRecommendationSummary = () => {
    const recommendations = reviews
      .map((r) => r.recommendation)
      .filter(Boolean);
    const counts = recommendations.reduce((acc: any, rec) => {
      acc[rec!] = (acc[rec!] || 0) + 1;
      return acc;
    }, {});

    // Determine overall recommendation based on majority
    if (counts.reject >= 1) return 'reject';
    if (counts.major_revision >= 1) return 'major_revision';
    if (counts.minor_revision >= 1) return 'minor_revision';
    if (counts.accept >= 1) return 'accept';
    return 'minor_revision'; // default
  };

  const suggestedDecision = getRecommendationSummary();

  const handleDecisionChange = (newDecision: string) => {
    setDecision(newDecision);

    const decisionTemplates = getDecisionTemplates();
    if (
      manuscript &&
      decisionTemplates[newDecision as keyof typeof decisionTemplates]
    ) {
      let template = decisionTemplates[
        newDecision as keyof typeof decisionTemplates
      ].replace(/\[EDITOR_NAME\]/g, 'Dr. Editor Name');

      // Generate reviewer comments summary
      const reviewerComments = reviews
        .filter((r) => r.recommendation)
        .map(
          (r, index) =>
            `Reviewer ${index + 1} (${r.reviewerName}): ${r.recommendation?.replace('_', ' ')}`
        )
        .join('\n');

      template = template.replace(/\[REVIEWER_COMMENTS\]/g, reviewerComments);
      setMessage(template);
    }
  };

  const handleSend = async () => {
    if (!decision || !message.trim()) {
      toast('Please select a decision and enter a message.');
      return;
    }

    setIsLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    toast(
      `Your ${decision.replace('_', ' ')} decision has been sent to the authors.`
    );

    setIsLoading(false);
    onClose();
    setDecision('');
    setMessage('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Send Decision to Authors</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Manuscript Info */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">{manuscript?.title}</CardTitle>
              <p className="text-slate-600">
                Authors: {manuscript?.authors.join(', ')}
              </p>
            </CardHeader>
          </Card>

          {/* Review Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Review Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm font-medium text-slate-600 mb-2">
                    Completed Reviews
                  </p>
                  <p className="text-2xl font-bold text-slate-900">
                    {reviews.length}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-600 mb-2">
                    Average Rating
                  </p>
                  <p className="text-2xl font-bold text-slate-900">
                    {reviews.length > 0
                      ? (
                          reviews.reduce((sum, r) => sum + (r.rating || 0), 0) /
                          reviews.length
                        ).toFixed(1)
                      : 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-600 mb-2">
                    Suggested Decision
                  </p>
                  <Badge
                    className={
                      suggestedDecision === 'accept'
                        ? 'bg-green-100 text-green-800'
                        : suggestedDecision === 'minor_revision'
                          ? 'bg-yellow-100 text-yellow-800'
                          : suggestedDecision === 'major_revision'
                            ? 'bg-orange-100 text-orange-800'
                            : 'bg-red-100 text-red-800'
                    }
                  >
                    {suggestedDecision
                      .replace('_', ' ')
                      .replace(/\b\w/g, (l) => l.toUpperCase())}
                  </Badge>
                </div>
              </div>

              <div className="mt-4">
                <p className="text-sm font-medium text-slate-600 mb-2">
                  Individual Recommendations
                </p>
                <div className="space-y-2">
                  {reviews.map((review, index) => (
                    <div
                      key={review.id}
                      className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
                    >
                      <span className="text-sm text-slate-700">
                        {review.reviewerName}
                      </span>
                      <Badge
                        className={
                          review.recommendation === 'accept'
                            ? 'bg-green-100 text-green-800'
                            : review.recommendation === 'minor_revision'
                              ? 'bg-yellow-100 text-yellow-800'
                              : review.recommendation === 'major_revision'
                                ? 'bg-orange-100 text-orange-800'
                                : 'bg-red-100 text-red-800'
                        }
                      >
                        {review.recommendation
                          ?.replace('_', ' ')
                          .replace(/\b\w/g, (l) => l.toUpperCase())}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Decision Selection */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Editorial Decision
              </label>
              <Select value={decision} onValueChange={handleDecisionChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your decision..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="accept">Accept</SelectItem>
                  <SelectItem value="minor_revision">
                    Minor Revision Required
                  </SelectItem>
                  <SelectItem value="major_revision">
                    Major Revision Required
                  </SelectItem>
                  <SelectItem value="reject">Reject</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Message */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Message to Authors
              </label>
              <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Enter your message to the authors..."
                className="min-h-[300px]"
              />
              <p className="text-xs text-slate-500 mt-2">
                The template above is automatically generated based on your
                decision. Feel free to customize it as needed.
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
            <Button variant="outline" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button onClick={handleSend} disabled={isLoading}>
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Sending...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Send Decision
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
