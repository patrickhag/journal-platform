'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  ArrowLeft,
  FileText,
  User,
  Calendar,
  History,
  SquarePen,
  Eye,
} from 'lucide-react';
import Link from 'next/link';
import { useGetParticularAssignment } from '@/hooks/useReviews';
import { useParams } from 'next/navigation';
import ReviewModal from '@/components/articles/Review';
import ReviewerAssignmentSkeleton from '@/components/ReviewerAssignmentSkeleton';

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
              {particularAssignment?.article.reviews.map((review, index) => (
                <div
                  key={index}
                  className="border rounded-lg p-4 bg-muted/50 mb-3"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <Badge>{review.status}</Badge>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {review.reviewedAt}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {review.message}
                  </p>
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
