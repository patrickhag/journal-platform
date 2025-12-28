'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileClock, FileText } from 'lucide-react';
import { useGetAssociateEditorsFinalizedAssignments } from '@/hooks/useReviews';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

function AssociateEditorDashboard() {
  const { data: assignments, isPending } =
    useGetAssociateEditorsFinalizedAssignments();

  return (
    <>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">
            Finalized Assignments
          </h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="mr-2 h-5 w-5" />
              My Assignments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {assignments?.length === 0 && !isPending ? (
                <p className="text-sm text-gray-500">
                  You have no active assignments.
                </p>
              ) : isPending ? (
                <p className="text-sm text-gray-500">Loading assignments...</p>
              ) : (
                assignments?.map((assignment) => {
                  const isPublished =
                    assignment.articleSubmissions.articleStatus === 'PUBLISHED';
                  return (
                    <div
                      key={assignment.id}
                      className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <Link
                              href={`/articles/${assignment.articleSubmissions.id}`}
                              target="_blank"
                              className="hover:underline"
                            >
                              <h3 className="font-semibold text-lg text-gray-900 line-clamp-1">
                                {assignment.articleSubmissions.metadata.title}
                              </h3>
                            </Link>
                          </div>
                          {!isPublished && (
                            <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                              <span>
                                Assigned:{' '}
                                {new Date(
                                  assignment.assignedAt
                                ).toLocaleDateString()}
                              </span>
                              <span>•</span>
                              <span>
                                Due:{' '}
                                {new Date(
                                  assignment.dueDate
                                ).toLocaleDateString()}
                              </span>
                            </div>
                          )}

                          <Badge>{assignment.status}</Badge>

                          {isPublished && (
                            <Badge className="bg-gray-100 text-gray-700">
                              PUBLISHED
                            </Badge>
                          )}
                        </div>
                        <div className="flex space-x-2 ml-4">
                          <Link
                            href={`/associate-editor/article/${assignment.id}`}
                          >
                            <Button
                              size="sm"
                              className="bg-blue-600 hover:bg-blue-700"
                            >
                              <FileClock className="mr-2 h-4 w-4" />
                              Past Corrections
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

export default AssociateEditorDashboard;
