'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  ArrowLeft,
  FileText,
  User,
  Calendar,
  History,
  SquarePen,
  Eye,
  CornerDownRight,
} from 'lucide-react';
import Link from 'next/link';
import { useGetParticularAssignment } from '@/hooks/useReviews';
import { useParams } from 'next/navigation';
import ReviewModal from '@/components/articles/Review';
import ReviewerAssignmentSkeleton from '@/components/ReviewerAssignmentSkeleton';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/lib/utils';

const ReviewAssignment = () => {
  const { assignmentId } = useParams();

  const { data: particularAssignment, isPending } = useGetParticularAssignment(
    assignmentId as string
  );

  const [reviewModal, setReviewModal] = useState<{
    isOpen: boolean;
    articleId?: string;
  }>({
    isOpen: false,
    articleId: '',
  });

  const handleSubmitReview = (articleId: string) => {
    setReviewModal({ isOpen: true, articleId });
  };

  const onClose = () => {
    setReviewModal({ isOpen: false });
  };

  // Show skeleton while loading
  if (isPending) {
    return <ReviewerAssignmentSkeleton isNotAssociate={true} />;
  }

  const authorName = `${particularAssignment?.article.metadata.prefix} ${particularAssignment?.article.user.firstName} ${particularAssignment?.article.user.lastName}`;

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Go Back
        </Button>
        {particularAssignment?.status !== 'FINALIZED' && (
          <Button
            type="submit"
            className="bg-primary hover:bg-primary/90"
            onClick={() =>
              handleSubmitReview(particularAssignment?.article.id as string)
            }
          >
            <SquarePen className="mr-2 h-4 w-4" />
            Submit Review
          </Button>
        )}
      </div>
      {/* Assignment Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-start justify-between">
            <div>
              <Link href={`/articles/${particularAssignment?.article.id}`}>
                <h1 className="text-lg font-bold mb-2 hover:underline line-clamp-1">
                  {particularAssignment?.article.metadata.title}
                </h1>
              </Link>
              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                <div className="flex items-center">
                  <User className="mr-1 h-4 w-4" />
                  {authorName}
                </div>
                <div className="flex items-center">
                  <Calendar className="mr-1 h-4 w-4" />
                  Due: {particularAssignment?.dueDate}
                </div>
              </div>
            </div>
          </CardTitle>
        </CardHeader>
      </Card>

      {/* Files Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="mr-2 h-5 w-5" />
            Manuscript Files
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {particularAssignment?.article.files.map((file, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 border rounded-lg"
            >
              <div className="flex items-center">
                <FileText className="mr-2 h-4 w-4 text-blue-600" />
                <span>{file.originalName}</span>
              </div>
              <Link href={file.publicId}>
                <Button size="sm" variant="outline">
                  <Eye className="mr-2 h-4 w-4" />
                  View
                </Button>
              </Link>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Previous Reviews (if any) */}
      {particularAssignment?.article.reviews &&
        particularAssignment?.article.reviews.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <History className="mr-2 h-5 w-5" />
                Previous Review History
              </CardTitle>
            </CardHeader>

            <CardContent>
              {particularAssignment.article.reviews.map((review, index) => (
                <div
                  key={index}
                  className="border rounded-lg p-4 bg-muted/50 mb-4 space-y-3"
                >
                  {/* Review header */}
                  <div className="flex items-center justify-between mb-2">
                    <Badge>{review.status}</Badge>
                    <span className="text-sm text-muted-foreground">
                      {formatDate(review.reviewedAt)}
                    </span>
                  </div>

                  {/* Reviewer comments */}
                  <p className="text-sm text-muted-foreground">
                    <span className="font-semibold">Comments: </span>
                    <span>{review.message}</span>
                  </p>

                  {/* Annotated Files */}
                  {review.fileIds.length > 0 && (
                    <div className="my-3">
                      <p className="text-sm text-muted-foreground mb-2 font-semibold">
                        Annotated Files
                      </p>
                      <div className="space-y-2">
                        {review.fileIds.map((fileId, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-3 border rounded-lg bg-muted/30"
                          >
                            <div className="flex items-center">
                              <FileText className="mr-2 h-4 w-4 text-blue-600" />
                              <span className="text-sm">
                                Reviewed file {index + 1}
                              </span>
                            </div>
                            <Link href={fileId} target="_blank">
                              <Button size="sm" variant="outline">
                                <Eye className="mr-2 h-4 w-4" />
                                View
                              </Button>
                            </Link>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* ============================== */}
                  {/* Revision Info (staff editor)   */}
                  {/* ============================== */}
                  {review.reviewRevisions &&
                    review.reviewRevisions.length > 0 && (
                      <div className="mt-5 border-t border-muted pt-4 space-y-4">
                        <div className="flex items-center gap-2">
                          <CornerDownRight className="h-4 w-4 text-muted-foreground" />
                          <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                            Requested Revisions
                          </h4>
                        </div>

                        {review.reviewRevisions.map((revision) => (
                          <div
                            key={revision.id}
                            className="ml-6 p-4 rounded-lg border bg-muted/20"
                          >
                            <div className="flex gap-2 mb-2">
                              <span className="font-medium text-sm">
                                Editor’s Note:
                              </span>{' '}
                              <div
                                className="prose prose-gray text-sm max-w-none text-foreground leading-relaxed text-justify"
                                dangerouslySetInnerHTML={{
                                  __html: revision.message || '',
                                }}
                              />
                            </div>

                            {/* Revision Files */}
                            {revision.fileIds &&
                              revision.fileIds.length > 0 && (
                                <div className="space-y-2 mt-2">
                                  {revision.fileIds.map((fileUrl, idx) => (
                                    <div
                                      key={idx}
                                      className="flex items-center justify-between p-2 rounded-md border bg-muted/30 hover:bg-muted/50 transition-colors"
                                    >
                                      <div className="flex items-center gap-3">
                                        <FileText className="h-4 w-4 text-green-500" />
                                        <span className="text-xs font-medium">
                                          File {idx + 1}
                                        </span>
                                      </div>

                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        asChild
                                      >
                                        <Link href={fileUrl} target="_blank">
                                          <Eye className="h-4 w-4" />
                                        </Link>
                                      </Button>
                                    </div>
                                  ))}
                                </div>
                              )}

                            <p className="text-xs text-muted-foreground mt-3">
                              Requested on: {formatDate(revision.requestedAt)}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                </div>
              ))}
            </CardContent>
          </Card>
        )}

      {reviewModal.isOpen && (
        <ReviewModal
          open={reviewModal.isOpen}
          onClose={onClose}
          articleId={reviewModal.articleId as string}
        />
      )}
    </div>
  );
};

export default ReviewAssignment;
