'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, Eye } from 'lucide-react';
import { useAssignedAssociateEditor } from '../hooks/useAssociateEditorHooks';
import { AssignmentCardSkeleton } from '../components/AssignmentCardSkeleton';
import { useRouter } from 'next/navigation';

export default function AssociateEditorDashboard() {
  const { data: associateEditorsAssigments, isPending } =
    useAssignedAssociateEditor();

  const router = useRouter();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">
          Current Assignments
        </h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="mr-2 h-5 w-5" />
            Current Assignments
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {isPending && (
              <>
                <AssignmentCardSkeleton />
                <AssignmentCardSkeleton />
                <AssignmentCardSkeleton />
              </>
            )}

            {!isPending &&
              (associateEditorsAssigments ?? []).length > 0 &&
              associateEditorsAssigments?.map((assignment) =>
                assignment.articleSubmissions.map((submission, index) => {
                  const authorName = `${submission.metadata?.prefix ?? ''} ${submission.user.firstName} ${submission.user.lastName}`;
                  return (
                    <div
                      key={`${assignment.id}-${index}`}
                      className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="font-semibold text-lg text-gray-900">
                              {submission.metadata?.title}
                            </h3>
                          </div>

                          <p className="text-gray-600 mb-3">by {authorName}</p>

                          <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                            <span>
                              Assigned on:{' '}
                              {new Date(
                                assignment.assignedAt
                              ).toLocaleDateString()}
                            </span>
                            <span>•</span>
                            <span>
                              Submitted on:{' '}
                              {new Date(
                                submission.createdAt
                              ).toLocaleDateString()}
                            </span>
                          </div>

                          <div className="flex items-center space-x-4">
                            <Badge variant={'outline'}>
                              {submission.articleStatus}
                            </Badge>
                          </div>
                        </div>

                        <div className="flex space-x-2 ml-4">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              router.push(`/articles/${submission.id}`)
                            }
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            View Article
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}

            {!isPending && associateEditorsAssigments?.length === 0 && (
              <p className="text-sm text-gray-500">
                You have no assigned submissions.
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
