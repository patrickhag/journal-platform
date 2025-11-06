'use client';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Eye } from 'lucide-react';
import { useGetFinalizedAssignments } from '@/hooks/useReviews';
import ArticleCardSkeleton from '../components/ReviewCardSkeleton';
import Link from 'next/link';

export default function FinalizedAssignments() {
  const { data: finalizedAssignments, isPending } =
    useGetFinalizedAssignments();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Finalized Assignments
          </h1>
          <p className="text-gray-600 mt-2">See the finalized assignments</p>
        </div>
      </div>

      {isPending &&
        [1, 2, 3, 4, 5, 6].map((i) => <ArticleCardSkeleton key={i} />)}

      {!isPending &&
        (!finalizedAssignments || finalizedAssignments.length === 0) && (
          <p className="text-sm text-gray-500 italic">
            You have no finalized assignments.
          </p>
        )}

      <div className="space-y-4">
        {finalizedAssignments?.map((assignment) => {
          const { id, article } = assignment;

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

                  <div className="flex items-center space-x-4">
                    <Badge
                      variant={'outline'}
                      className="bg-yellow-100 text-yellow-800"
                    >
                      {articleStatus}
                    </Badge>
                  </div>
                </div>

                <div className="flex space-x-2 ml-4">
                  <Link href={`/articles/${article.id}`}>
                    <Button variant="outline" size="sm">
                      <Eye className="mr-2 h-4 w-4" />
                      View Details
                    </Button>
                  </Link>
                  <Link href={`/reviewer/article/${assignment.id}`}>
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                      <Clock className="mr-2 h-4 w-4" />
                      Past Reviews
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
