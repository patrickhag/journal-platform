'use client';

import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  CheckSquare,
  ChevronLeft,
  Download,
  File,
  FileSearch2,
  Repeat,
} from 'lucide-react';
import { StatusBadge } from '@/components/status-badge';
import { useParams, useRouter } from 'next/navigation';
import { useGetReviews } from '@/hooks/useReviews';
import { useState } from 'react';
import EditorDecisionModal from './components/EditorDecisionModal';
import EditorReReviewModal from './components/EditorReReview';

export default function ReviewsPage() {
  const { articleId } = useParams();

  const { data: reviewData } = useGetReviews(articleId as string);
  const [open, setOpen] = useState(false);
  const [reviewerUserId, setReviewerUserId] = useState('');
  const [reviewerName, setReviewerName] = useState('');
  const [revieweEmail, setReviewerEMail] = useState('');

  const router = useRouter();
  const onClose = () => setOpen(false);

  const handleReReviewRequest = (
    reviewId: string,
    reviewerName: string,
    formReviwerEmail: string
  ) => {
    setOpen(true);
    setReviewerUserId(reviewId);
    setReviewerName(reviewerName);
    setReviewerEMail(formReviwerEmail);
  };

  return (
    <>
      <div className="container mx-auto py-6 max-w-7xl">
        <div className="flex justify-between gap-4 mb-6">
          <Button variant="link" size="sm" onClick={() => router.back()}>
            <ChevronLeft className="h-4 w-4 mr-2" />
            Go back
          </Button>
          <Button
            className="bg-amber-600 hover:bg-amber-700"
            onClick={() => setOpen(true)}
          >
            <CheckSquare className="mr-2 h-4 w-4" />
            Make Decision
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <Card className="md:col-span-4">
            <CardHeader>
              <CardTitle>Article Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium">Title</h3>
                  <p className="text-sm text-muted-foreground">
                    {reviewData?.metadata.title}
                  </p>
                </div>
                <div>
                  <h3 className="font-medium">Status</h3>
                  <StatusBadge status={reviewData?.articleStatus as string} />
                </div>
                <div>
                  <h3 className="font-medium">Author</h3>
                  <p>
                    {reviewData?.user.firstName +
                      ' ' +
                      reviewData?.user.lastName}
                  </p>
                </div>
                <div>
                  <h3 className="font-medium">Reviews</h3>
                  <div className="flex items-center gap-2 mt-2">
                    <FileSearch2 className="h-4 w-4" />
                    <span className="text-sm">
                      {reviewData?.reviews.length} Submitted Review(s)
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Main content area */}
          <div className="md:col-span-8">
            <Card>
              <CardContent className="p-6">
                <ScrollArea className="h-[600px] pr-4">
                  <div className="space-y-6">
                    {reviewData &&
                    reviewData.reviews &&
                    reviewData.reviews.length > 0 ? (
                      reviewData.reviews.map((review) => (
                        <Card key={review.id}>
                          <CardHeader>
                            <div className="flex items-center justify-between">
                              <div>
                                <h3 className="font-semibold">
                                  {review.user.firstName} {review.user.lastName}
                                </h3>
                              </div>
                              <Badge>{review.status}</Badge>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm mb-4">{review.message}</p>

                            {/* Files */}
                            {review.fileIds && review.fileIds.length > 0 && (
                              <div className="mt-4">
                                <h4 className="text-sm font-medium mb-3">
                                  Associated Files
                                </h4>
                                <div className="space-y-2">
                                  {review.fileIds.map((fileUrl, idx) => (
                                    <div
                                      key={idx}
                                      className="flex items-center justify-between p-3 rounded-lg border bg-muted/30 hover:bg-muted/50 transition-colors"
                                    >
                                      <div className="flex items-center gap-3">
                                        <File className="h-4 w-4 text-red-500" />
                                        <div>
                                          <h5 className="text-sm font-medium">
                                            File {idx + 1}
                                          </h5>
                                          <p className="text-xs text-muted-foreground">
                                            <a
                                              href={fileUrl}
                                              target="_blank"
                                              rel="noopener noreferrer"
                                              className="underline"
                                            >
                                              View File
                                            </a>
                                          </p>
                                        </div>
                                      </div>
                                      <div>
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          asChild
                                        >
                                          <a href={fileUrl} download>
                                            <Download className="h-4 w-4" />
                                          </a>
                                        </Button>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                            <div className="flex justify-between gap-2">
                              <div className="mt-4 text-sm text-muted-foreground">
                                Submitted on {review.reviewedAt}
                              </div>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() =>
                                  handleReReviewRequest(
                                    review.userId,
                                    review.user.firstName +
                                      ' ' +
                                      review.user.lastName,
                                    review.user.email
                                  )
                                }
                              >
                                <Repeat />
                                Request Re-Review
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full pt-24 text-center text-muted-foreground">
                        <FileSearch2 className="w-12 h-12 mb-4 text-muted-foreground" />
                        <p className="text-sm">
                          No reviews have been submitted for this article yet.
                        </p>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <EditorDecisionModal
        isOpen={open}
        onClose={onClose}
        articleId={articleId as string}
      />
      <EditorReReviewModal
        isOpen={open}
        onClose={onClose}
        articleId={articleId as string}
        reviewerId={reviewerUserId}
        reviewerName={reviewerName}
        reviewerEmail={revieweEmail}
      />
    </>
  );
}
