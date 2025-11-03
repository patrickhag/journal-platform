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
import { Eye } from 'lucide-react';
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
import { ReviewCard } from '@/components/ReviewCard';

const ReviewsReceived = () => {
  const { data: manuscripts, isPending } = useGetAuthorsReviews();

  const [selectedManuscript, setSelectedManuscript] =
    useState<TArticlesReview | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const handleViewReviews = (manuscript: TArticlesReview) => {
    setSelectedManuscript(manuscript);
    setIsSheetOpen(true);
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
                  <ReviewCard
                    key={review.id}
                    review={review}
                    showDownloadButton={true}
                    showViewButton={true}
                    reviewerDisplayName={`Reviewer ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </div>

          <SheetFooter className="sticky bottom-0 bg-white mt-4 py-4 flex justify-end gap-2">
            <AuthorReplyModal articleId={selectedManuscript?.id || ''} />
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default ReviewsReceived;
