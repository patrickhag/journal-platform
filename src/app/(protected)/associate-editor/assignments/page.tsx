'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Eye, Upload, FileText, File } from 'lucide-react';
import { useGetAssociateEditorsAssignments } from '@/hooks/useReviews';
import { Badge } from '@/components/ui/badge';
import { TAssociateEditorAssignments } from '@/types';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

function AssociateEditorDashboard() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { data: assignments, isPending } = useGetAssociateEditorsAssignments();

  const [selectedAssignment, setSelectedAssignment] =
    useState<TAssociateEditorAssignments | null>(null);
  const isAccepted = searchParams.get('isAccepted');
  const message = searchParams.get('message');

  useEffect(() => {
    if (isAccepted !== null && Number(isAccepted) === 1) {
      toast.success(
        'Thank you for accepting the invitation of editing and formatting the manuscript'
      );
    } else if (isAccepted !== null && Number(isAccepted) === 0) {
      toast.info('Thank you for letting us know!');
    } else if (message) {
      const cleanMessage = message.replace(/['"]+/g, '');
      toast.info(cleanMessage);
    }

    if (isAccepted !== null || message) {
      const newUrl = window.location.pathname;
      router.replace(newUrl);
    }
  }, [isAccepted, message, router]);

  return (
    <>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">My Assignments</h1>
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
                          {!isPublished && (
                            <Badge>
                              {assignment.articleSubmissions.articleStatus}
                            </Badge>
                          )}
                          {isPublished && (
                            <Badge className="bg-gray-100 text-gray-700">
                              PUBLISHED
                            </Badge>
                          )}
                        </div>
                        <div className="flex space-x-2 ml-4">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  setSelectedAssignment(assignment)
                                }
                              >
                                <Eye className="h-4 w-4 mr-2" />
                                View Assignment
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                              {selectedAssignment && (
                                <div className="space-y-6">
                                  <div>
                                    <h4 className="text-md font-medium mb-3">
                                      Comments of staff editor
                                    </h4>
                                    <div className="prose max-w-none">
                                      <p className="text-gray-700 whitespace-pre-wrap">
                                        {selectedAssignment.message}
                                      </p>
                                    </div>
                                  </div>
                                  <div>
                                    {selectedAssignment.fileIds &&
                                      selectedAssignment.fileIds.length > 0 && (
                                        <>
                                          <h4 className="text-md font-medium mb-3">
                                            Annotated File
                                          </h4>
                                          <div>
                                            <div className="space-y-2">
                                              {selectedAssignment.fileIds.map(
                                                (fileUrl, idx) => (
                                                  <div
                                                    key={idx}
                                                    className="flex items-center justify-between p-3 rounded-lg border bg-muted/30 hover:bg-muted/50 transition-colors mb-3"
                                                  >
                                                    <div className="flex items-center gap-3">
                                                      <File className="h-4 w-4 text-green-500" />
                                                      <div>
                                                        <h5 className="text-xs font-medium">
                                                          File {idx + 1}
                                                        </h5>
                                                      </div>
                                                    </div>
                                                    <div>
                                                      <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        asChild
                                                      >
                                                        <a
                                                          href={fileUrl}
                                                          download
                                                          target="_blank"
                                                        >
                                                          <Eye className="h-4 w-4" />
                                                        </a>
                                                      </Button>
                                                    </div>
                                                  </div>
                                                )
                                              )}
                                            </div>
                                          </div>
                                        </>
                                      )}
                                  </div>
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>
                          <Link
                            href={`/associate-editor/article/${assignment.id}`}
                          >
                            <Button
                              size="sm"
                              className="bg-blue-600 hover:bg-blue-700"
                            >
                              <Upload className="mr-2 h-4 w-4" />
                              Submit Correction
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
