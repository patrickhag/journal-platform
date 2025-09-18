'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Eye, Download, Reply } from 'lucide-react';
import { toast } from 'sonner';
import AuthorReplyModal from './components/AuthorReplyModal';
import { useGetAuthorsReviews } from '@/hooks/useReviews';
import { ReviewersReview, TArticlesReview } from '@/types';
import Link from 'next/link';

const ReviewsReceived = () => {
  const { data: manuscripts, isPending } = useGetAuthorsReviews();

  const [selectedManuscript, setSelectedManuscript] =
    useState<TArticlesReview | null>(null);
  const [replyModalOpen, setReplyModalOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState<ReviewersReview | null>(
    null
  );

  const getRecommendationBadge = (status: string) => {
    const config = {
      Accepted: { variant: 'default' as const, label: 'Accepted' },
      'Minor Collection': {
        variant: 'secondary' as const,
        label: 'Minor Collection',
      },
      'Major Revision': {
        variant: 'destructive' as const,
        label: 'Major Revision',
      },
      Rejected: { variant: 'destructive' as const, label: 'Rejected' },
    };

    const badgeConfig = config[status as keyof typeof config];
    return badgeConfig ? (
      <Badge variant={badgeConfig.variant}>{badgeConfig.label}</Badge>
    ) : null;
  };

  const handleViewReviews = (manuscript: TArticlesReview) => {
    setSelectedManuscript(manuscript);
  };

  const handleDownloadReview = () => {
    toast('Review document is being downloaded.');
  };

  const handleReplyToReview = (review: ReviewersReview) => {
    setSelectedReview(review);
    setReplyModalOpen(true);
  };

  const canReplyToReview = (status: string) => {
    return status === 'Minor Collection' || status === 'Major Revision';
  };

  const getReviewsInfo = (
    reviews: ReviewersReview[],
    manuscript: TArticlesReview
  ) => {
    const review = reviews.find((review) => review.articleId === manuscript.id);
    return review?.reviewedAt;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Reviews Received</h1>
      </div>

      {/* Manuscripts Table */}
      <Card>
        <CardHeader>
          <CardTitle>Manuscripts with Reviews</CardTitle>
        </CardHeader>
        <CardContent>
          {isPending ? (
            <p className="my-3">Loading...</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Manuscript Title</TableHead>
                  <TableHead>Reviewed At</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Reviews Progress</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {manuscripts?.map((manuscript) => (
                  <TableRow key={manuscript.id}>
                    <TableCell className="font-medium">
                      {manuscript.metadata.title}
                    </TableCell>
                    <TableCell>
                      {getReviewsInfo(manuscript.reviews, manuscript)}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {manuscript.articleStatus}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">
                        {manuscript.reviews.length} review(s)
                      </span>
                    </TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        onClick={() => handleViewReviews(manuscript)}
                        className="flex items-center gap-2"
                      >
                        <Eye className="h-4 w-4" />
                        View Reviews
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Review Details */}
      {selectedManuscript && (
        <Card>
          <CardHeader>
            <CardTitle>
              Reviews for: {selectedManuscript.metadata.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {selectedManuscript.reviews.map((review, index) => (
                <div
                  key={review.id}
                  className="border rounded-lg p-4 space-y-3"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold">Reviewer {index + 1}</h4>
                      <p className="text-sm text-gray-600">
                        Reviewed:{' '}
                        {new Date(review.reviewedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {getRecommendationBadge(review.status)}
                    </div>
                  </div>

                  <div>
                    <h5 className="font-medium mb-2">Comments:</h5>
                    <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded">
                      {review.message}
                    </p>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex gap-2">
                      {review.fileIds.length > 0 && (
                        <Link href={review.fileIds[0]}>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDownloadReview()}
                            className="flex items-center gap-2"
                          >
                            <Download className="h-4 w-4" />
                            Download Review
                          </Button>
                        </Link>
                      )}
                      {canReplyToReview(review.status) && (
                        <Button
                          size="sm"
                          onClick={() => handleReplyToReview(review)}
                          className="flex items-center gap-2"
                        >
                          <Reply className="h-4 w-4" />
                          Reply to Review
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Reply Modal */}
      {selectedReview && (
        <AuthorReplyModal
          isOpen={replyModalOpen}
          onClose={() => {
            setReplyModalOpen(false);
            setSelectedReview(null);
          }}
          review={selectedReview}
          manuscriptTitle={selectedManuscript?.metadata.title || ''}
        />
      )}
    </div>
  );
};

export default ReviewsReceived;
