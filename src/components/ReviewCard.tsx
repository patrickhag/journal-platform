'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { File, Eye, Repeat } from 'lucide-react';
import Link from 'next/link';

interface Review {
  id: string;
  articleId?: string | null;
  reviewedAt: string | null;
  status: string | null;
  message: string;
  fileIds: string[];
  user: {
    firstName: string;
    lastName: string;
    email?: string;
    prefix?: string | null;
  };
}

interface ReviewCardProps {
  review: Review;
  showReReviewButton?: boolean;
  showViewButton?: boolean;
  onReReviewClick?: (review: Review) => void;
  reviewerDisplayName?: string;
  className?: string;
}

export const ReviewCard = ({
  review,
  showReReviewButton = false,
  showViewButton = true,
  onReReviewClick,
  reviewerDisplayName,
  className = '',
}: ReviewCardProps) => {
  const reviewerName =
    reviewerDisplayName ||
    `${review.user.prefix ?? ''} ${review.user.firstName} ${review.user.lastName}`.trim();

  const getStatusBadge = (status: string | null) => {
    if (!status) {
      return <Badge variant="default">Pending</Badge>;
    }

    const badgeConfig: Record<
      string,
      {
        variant: 'default' | 'secondary' | 'destructive' | 'outline';
        label: string;
      }
    > = {
      Accepted: { variant: 'default', label: 'Accepted' },
      'Minor Collection': { variant: 'secondary', label: 'Minor Collection' },
      'Major Revision': { variant: 'destructive', label: 'Major Revision' },
      Rejected: { variant: 'destructive', label: 'Rejected' },
    };

    const config = badgeConfig[status] || { variant: 'default', label: status };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold">{reviewerName}</h3>
          </div>
          {getStatusBadge(review.status)}
        </div>
      </CardHeader>
      <CardContent>
        {review.message && (
          <p className="text-sm mb-4">
            <span className="font-semibold">Reviewer's comment:</span>{' '}
            {review.message}
          </p>
        )}

        {/* Annotated Files */}
        {review.fileIds && review.fileIds.length > 0 && (
          <div className="mt-4">
            <h4 className="text-sm font-medium mb-3">Annotated Files</h4>
            <div className="space-y-2">
              {review.fileIds.map((fileUrl, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 rounded-lg border bg-muted/30 hover:bg-muted/50 transition-colors mb-3"
                >
                  <div className="flex items-center gap-3">
                    <File className="h-4 w-4 text-green-500" />
                    <div>
                      <h5 className="text-sm font-medium">File {idx + 1}</h5>
                    </div>
                  </div>

                  {showViewButton && (
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={fileUrl} target="_blank">
                        <Eye className="h-4 w-4" />
                      </Link>
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Review Date and Actions */}
        <div className="flex items-center justify-between gap-2 mt-4">
          <div className="text-sm text-muted-foreground">
            {review.reviewedAt
              ? `Reviewed on: ${review.reviewedAt}`
              : 'Not reviewed yet'}
          </div>

          <div className="flex items-center gap-2">
            {showReReviewButton && onReReviewClick && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => onReReviewClick(review)}
              >
                <Repeat />
                Request Re-Review
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
