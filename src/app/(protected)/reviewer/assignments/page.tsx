'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, Eye, Upload } from 'lucide-react';
import { useGetReviewerAssignments } from '@/hooks/useReviews';
import { useRouter } from 'next/navigation';
import ReviewModal from '@/components/articles/Review';
import ArticleCardSkeleton from '../components/ReviewCardSkeleton';
import {
  calculateDaysRemaining,
  cn,
  getAssignmentStatusColor,
  getUrgencyColor,
} from '@/lib/utils';

export default function ReviewerDashboard() {
  const { data, isPending } = useGetReviewerAssignments();

  const reviewerAssignments = data?.assignedArticles;

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

  // const filteredAssignments = reviewerAssignments?.filter((assignment) => {
  //   const daysRemaining = calculateDaysRemaining(assignment.dueDate);
  //   return (
  //     assignment.article.articleStatus === 'PUBLISHED' || daysRemaining >= 0
  //   );
  // });

  const router = useRouter();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Review Assignments</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="mr-2 h-5 w-5" />
            Current Assignments
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isPending && [1, 2, 3].map((i) => <ArticleCardSkeleton key={i} />)}
          <div className="space-y-4">
            {reviewerAssignments?.map((assignment) => {
              const { id, status, assignedDate, dueDate, article } = assignment;

              const daysRemaining = calculateDaysRemaining(dueDate);
              const isPublished = article.articleStatus === 'PUBLISHED';
              const author = `${article.metadata?.prefix ?? ''}. ${article.user.firstName} ${article.user.lastName}`;
              const title = article.metadata?.title;

              return (
                <div
                  key={id}
                  className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="font-semibold text-lg text-gray-900 line-clamp-1">
                          {title}
                        </h3>
                      </div>

                      <p className="text-gray-600 mb-3">by {author}</p>
                      {!isPublished && (
                        <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                          <span>
                            Assigned:{' '}
                            {new Date(assignedDate).toLocaleDateString()}
                          </span>
                          <span>•</span>
                          <span>
                            Due: {new Date(dueDate).toLocaleDateString()}
                          </span>
                        </div>
                      )}

                      <div className="flex items-center space-x-4">
                        <Badge
                          variant={'outline'}
                          className={cn(
                            'lowercase',
                            getAssignmentStatusColor(status)
                          )}
                        >
                          invitation {status}
                        </Badge>
                        {!isPublished && (
                          <Badge
                            className={getUrgencyColor(daysRemaining, status)}
                          >
                            {daysRemaining === 0
                              ? 'Due today'
                              : `${daysRemaining} days remaining`}
                          </Badge>
                        )}
                        {isPublished && (
                          <Badge className="bg-gray-100 text-gray-700">
                            PUBLISHED
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="flex space-x-2 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => router.push(`/articles/${article.id}`)}
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        View Article
                      </Button>
                      {/* {!isPublished && status === 'ACCEPTED' && ( */}
                      <Button
                        size="sm"
                        className="bg-blue-600 hover:bg-blue-700"
                        onClick={() => handleSubmitReview(article.id)}
                      >
                        <Upload className="mr-2 h-4 w-4" />
                        Submit Review
                      </Button>
                      {/* )} */}
                    </div>
                  </div>
                </div>
              );
            })}

            {!isPending && reviewerAssignments?.length === 0 && (
              <p className="text-sm text-gray-500">
                You have no active assignments.
              </p>
            )}
          </div>
        </CardContent>
      </Card>
      {reviewModal.isOpen && (
        <ReviewModal
          open={reviewModal.isOpen}
          onClose={onClose}
          articleId={reviewModal.articleId as string}
        />
      )}
    </div>
  );
}
