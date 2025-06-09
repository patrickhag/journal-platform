import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { useState } from 'react';
import { ArrowDown, ArrowUp } from 'lucide-react';

interface Review {
  id: string;
  reviewerName: string;
  reviewerAffiliation: string;
  status: 'pending' | 'in_progress' | 'completed' | 'overdue';
  submittedDate?: string;
  recommendation:
    | 'accept'
    | 'minor_revision'
    | 'major_revision'
    | 'reject'
    | null;
  comments: string;
  confidentialComments: string;
  rating: number | null;
}

interface ReviewCardProps {
  review: Review;
}

export const ReviewCard = ({ review }: ReviewCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showConfidential, setShowConfidential] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRecommendationColor = (recommendation: string | null) => {
    if (!recommendation) return 'bg-gray-100 text-gray-800';

    switch (recommendation) {
      case 'accept':
        return 'bg-green-100 text-green-800';
      case 'minor_revision':
        return 'bg-yellow-100 text-yellow-800';
      case 'major_revision':
        return 'bg-orange-100 text-orange-800';
      case 'reject':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRecommendationText = (recommendation: string | null) => {
    if (!recommendation) return 'Pending';
    return recommendation
      .replace('_', ' ')
      .replace(/\b\w/g, (l) => l.toUpperCase());
  };

  const getRatingStars = (rating: number | null) => {
    if (!rating) return null;
    return (
      '★'.repeat(Math.floor(rating / 2)) +
      '☆'.repeat(5 - Math.floor(rating / 2))
    );
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <CardTitle className="text-lg">{review.reviewerName}</CardTitle>
              <Badge className={getStatusColor(review.status)}>
                {review.status
                  .replace('_', ' ')
                  .replace(/\b\w/g, (l) => l.toUpperCase())}
              </Badge>
            </div>
            <p className="text-slate-600 text-sm">
              {review.reviewerAffiliation}
            </p>
            {review.submittedDate && (
              <p className="text-slate-500 text-xs mt-1">
                Submitted: {new Date(review.submittedDate).toLocaleDateString()}
              </p>
            )}
          </div>

          <div className="flex flex-col items-end gap-2">
            {review.recommendation && (
              <Badge className={getRecommendationColor(review.recommendation)}>
                {getRecommendationText(review.recommendation)}
              </Badge>
            )}
            {review.rating && (
              <div className="text-sm text-slate-600">
                Rating: {review.rating}/10
              </div>
            )}
          </div>
        </div>
      </CardHeader>

      {review.status === 'completed' && (
        <CardContent className="pt-0">
          <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
            <CollapsibleTrigger asChild>
              <Button variant="outline" className="w-full mb-4">
                {isExpanded ? (
                  <>
                    <ArrowUp className="mr-2 h-4 w-4" />
                    Hide Review Details
                  </>
                ) : (
                  <>
                    <ArrowDown className="mr-2 h-4 w-4" />
                    View Review Details
                  </>
                )}
              </Button>
            </CollapsibleTrigger>

            <CollapsibleContent className="space-y-4">
              {/* Public Comments */}
              <div>
                <h4 className="font-semibold text-slate-900 mb-2">
                  Comments for Authors
                </h4>
                <div className="bg-slate-50 p-4 rounded-lg">
                  <p className="text-slate-700 whitespace-pre-line">
                    {review.comments}
                  </p>
                </div>
              </div>

              {/* Confidential Comments */}
              {review.confidentialComments && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-slate-900">
                      Confidential Comments
                    </h4>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowConfidential(!showConfidential)}
                    >
                      {showConfidential ? 'Hide' : 'Show'}
                    </Button>
                  </div>
                  {showConfidential && (
                    <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg">
                      <p className="text-slate-700 whitespace-pre-line">
                        {review.confidentialComments}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Review Metadata */}
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-200">
                <div>
                  <p className="text-sm font-medium text-slate-600">
                    Review ID
                  </p>
                  <p className="text-sm text-slate-900">{review.id}</p>
                </div>
                {review.rating && (
                  <div>
                    <p className="text-sm font-medium text-slate-600">
                      Detailed Rating
                    </p>
                    <p className="text-sm text-slate-900">
                      {getRatingStars(review.rating)} ({review.rating}/10)
                    </p>
                  </div>
                )}
              </div>
            </CollapsibleContent>
          </Collapsible>
        </CardContent>
      )}

      {review.status !== 'completed' && (
        <CardContent className="pt-0">
          <div className="bg-slate-50 p-4 rounded-lg text-center">
            <p className="text-slate-600">
              {review.status === 'in_progress'
                ? 'Review in progress...'
                : review.status === 'overdue'
                  ? 'Review overdue - consider sending reminder'
                  : 'Waiting for reviewer response'}
            </p>
            {review.status === 'overdue' && (
              <Button variant="outline" size="sm" className="mt-2">
                Send Reminder
              </Button>
            )}
          </div>
        </CardContent>
      )}
    </Card>
  );
};
