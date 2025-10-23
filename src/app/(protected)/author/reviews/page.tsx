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
import { Eye, Download } from 'lucide-react';
import { toast } from 'sonner';
import AuthorReplyModal from './components/AuthorReplyModal';
import { useGetAuthorsReviews } from '@/hooks/useReviews';
import { ReviewersReview, TArticlesReview } from '@/types';
import Link from 'next/link';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';

const ReviewsReceived = () => {
  const { data: manuscripts, isPending } = useGetAuthorsReviews();

  console.log('manuscripts:', manuscripts);

  const [selectedManuscript, setSelectedManuscript] =
    useState<TArticlesReview | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  // const [replyModalOpen, setReplyModalOpen] = useState(false);
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
    setIsSheetOpen(true);
  };

  const handleDownloadReview = () => {
    toast('Review document is being downloaded.');
  };

  const handleReplyToReview = (review: ReviewersReview) => {
    setSelectedReview(review);
    // setReplyModalOpen(true);
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
                    <TableCell className="font-medium hover:underline">
                      <Link href={`/articles/${manuscript.id}`} target="_blank">
                        {manuscript.metadata.title}
                      </Link>
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
          {!isPending && manuscripts?.length === 0 && (
            <p className="my-3">No manuscripts found here.</p>
          )}
        </CardContent>
      </Card>

      {/* Sheet for Reviews */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent
          side="right"
          className="w-full sm:max-w-2xl flex flex-col h-full"
        >
          {/* Scrollable content area */}
          <div className="flex-1 overflow-y-auto">
            <SheetHeader>
              <SheetTitle>
                {selectedManuscript
                  ? `Reviews for: ${selectedManuscript.metadata.title}`
                  : 'Reviews'}
              </SheetTitle>
              <SheetDescription>
                Review details and reviewer feedback
              </SheetDescription>
            </SheetHeader>

            {selectedManuscript && (
              <div className="space-y-4 mt-6">
                {selectedManuscript.reviews.map((review, index) => (
                  <Card key={review.id} className="border rounded-lg">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold">
                            Reviewer {index + 1}
                          </h4>
                          <p className="text-sm text-gray-600">
                            Reviewed:{' '}
                            {new Date(review.reviewedAt).toLocaleDateString()}
                          </p>
                        </div>
                        {getRecommendationBadge(review.status)}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <h5 className="font-medium mb-2">Comments:</h5>
                        <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded">
                          {review.message}
                        </p>
                      </div>

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
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          <SheetFooter className="sticky bottom-0 bg-white mt-4 py-4 flex justify-end gap-2">
            <AuthorReplyModal />
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* Reply Modal */}
    </div>
  );
};

export default ReviewsReceived;
