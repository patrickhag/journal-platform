'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, Eye, Hourglass } from 'lucide-react';
import { useGetAssignedStaffEditor } from '../hooks/useAssociateEditorHooks';
import { AssignmentCardSkeleton } from '../components/AssignmentCardSkeleton';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import Link from 'next/link';
import { useState } from 'react';

export default function AssociateEditorDashboard() {
  const [selectedStatus] = useState('UNDER REVIEW');
  const { data: associateEditorsAssigments, isPending } =
    useGetAssignedStaffEditor(selectedStatus);

  const router = useRouter();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">
          Under Review Assignments
        </h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="mr-2 h-5 w-5" />
            Assignments Under Review
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {isPending && (
              <>
                <AssignmentCardSkeleton />
                <AssignmentCardSkeleton />
                <AssignmentCardSkeleton />
                <AssignmentCardSkeleton />
              </>
            )}
            {!isPending && associateEditorsAssigments?.length === 0 && (
              <p className="text-sm text-gray-500">
                You have no under review assignments.
              </p>
            )}
            {Array.isArray(associateEditorsAssigments) &&
              associateEditorsAssigments.length > 0 &&
              associateEditorsAssigments.map((assignment, index) => {
                const authorName = `${assignment.articleSubmission.metadata?.prefix ?? ''}. ${assignment.articleSubmission.user.firstName} ${assignment.articleSubmission.user.lastName}`;

                return (
                  <div
                    key={`${assignment.id}-${index}`}
                    className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="font-semibold text-lg text-gray-900 line-clamp-1">
                            {assignment.articleSubmission?.metadata?.title}
                          </h3>
                        </div>

                        <p className="text-gray-600 mb-3">by {authorName}</p>

                        <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                          <span>
                            Assigned:{' '}
                            {format(
                              new Date(assignment.assignedAt),
                              'MMM dd, yyyy'
                            )}
                          </span>
                          <span>•</span>
                          <span>
                            Submitted:{' '}
                            {format(
                              new Date(assignment.articleSubmission.createdAt),
                              'MMM dd, yyyy'
                            )}
                          </span>
                        </div>

                        <div className="flex items-center space-x-4">
                          <Badge variant={'outline'}>
                            {assignment.articleSubmission.articleStatus}
                          </Badge>
                        </div>
                      </div>

                      <div className="flex space-x-2 ml-4">
                        <Button
                          variant="outline"
                          size="sm"
                          className="bg-amber-600 hover:bg-amber-700 text-white hover:text-white"
                          onClick={() =>
                            router.push(
                              `/articles/reviews/${assignment.articleSubmission.id}`
                            )
                          }
                        >
                          <Hourglass className="mr-1 h-3 w-3" />
                          View Reviews
                        </Button>
                        <Link
                          href={`/articles/${assignment.articleSubmission.id}`}
                        >
                          <Button variant="outline" size="sm">
                            <Eye className="mr-2 h-4 w-4" />
                            View Article
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
