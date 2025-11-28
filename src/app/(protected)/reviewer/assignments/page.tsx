'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, Eye, Calendar, Clock, PenLine } from 'lucide-react';
import { useGetReviewerAssignments } from '@/hooks/useReviews';
import { useRouter } from 'next/navigation';
import ReviewModal from '@/components/articles/Review';
import ArticleCardSkeleton from '../components/ReviewCardSkeleton';
import Link from 'next/link';

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

  const onClose = () => {
    setReviewModal({ isOpen: false });
  };

  const router = useRouter();

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Review Assignments</h1>
      <Card>
        <CardHeader>
          <div className="flex justify-between">
            <CardTitle className="flex items-center">
              <FileText className="mr-2 h-5 w-5" />
              Current Assignments
            </CardTitle>
            <p className="text-sm text-gray-500 font-semibold flex-2">
              Total Assignments: {reviewerAssignments?.length ?? 0}
            </p>
          </div>
        </CardHeader>
        <CardContent>
          {isPending &&
            [1, 2, 3, 4, 5, 6].map((i) => <ArticleCardSkeleton key={i} />)}
          <div className="space-y-4">
            {reviewerAssignments?.map((assignment) => {
              const { id, article } = assignment;

              const isPublished = article.articleStatus === 'PUBLISHED';
              const author = `${article.metadata?.prefix ?? ''}. ${article.user.firstName} ${article.user.lastName}`;
              const title = article.metadata?.title;
              const articleStatus = assignment.article.articleStatus;

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

                      <p className="text-gray-600 mb-3">Author: {author}</p>
                      {!isPublished && (
                        <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-4 w-4 text-gray-400" />
                            <span>
                              Assigned:{' '}
                              {new Date(
                                assignment.assignedDate
                              ).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="h-4 w-4 text-gray-400" />
                            <span>
                              Due:{' '}
                              {new Date(
                                assignment.dueDate
                              ).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      )}

                      <div className="flex items-center space-x-4">
                        <Badge
                          variant={'outline'}
                          className="bg-yellow-100 text-yellow-800"
                        >
                          {articleStatus}
                        </Badge>
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
                      <Link href={`/reviewer/assignment/${assignment.id}`}>
                        <Button
                          size="sm"
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          <PenLine className="mr-2 h-4 w-4" />
                          Submit Reviewed Article
                        </Button>
                      </Link>
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
