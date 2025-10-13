'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, User, Calendar, SquarePen } from 'lucide-react';
import Link from 'next/link';
import { useGetAssociateEditorParticularAssignment } from '@/hooks/useReviews';
import { useParams } from 'next/navigation';
import ReviewerAssignmentSkeleton from '@/components/ReviewerAssignmentSkeleton';
import { formatDateToYMD } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

const ParticularAssociateAssignment = () => {
  const { assignmentId } = useParams();

  const { data: particularAssignment, isPending } =
    useGetAssociateEditorParticularAssignment(assignmentId as string);

  if (isPending) {
    return <ReviewerAssignmentSkeleton />;
  }

  const authorName = `${particularAssignment?.articleSubmissions.metadata.prefix}. ${particularAssignment?.articleSubmissions.user.firstName} ${particularAssignment?.articleSubmissions.user.lastName}`;

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Go Back
        </Button>
        <Button
          type="submit"
          className="bg-primary hover:bg-primary/90"
          // onClick={() =>
          //   handleSubmitCorrection(
          //     particularAssignment?.articleSubmissions.id as string
          //   )
          // }
        >
          <SquarePen className="mr-2 h-4 w-4" />
          Submit Correction
        </Button>
      </div>
      {/* Assignment Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-start justify-between">
            <div>
              <Link
                href={`/articles/${particularAssignment?.articleSubmissions.id}`}
              >
                <h1 className="text-lg font-bold mb-2 hover:underline line-clamp-1">
                  {particularAssignment?.articleSubmissions.metadata.title}
                </h1>
              </Link>
              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                <div className="flex items-center">
                  <User className="mr-1 h-4 w-4" />
                  {authorName}
                </div>
                <div className="flex items-center">
                  <Calendar className="mr-1 h-4 w-4" />
                  Due:{' '}
                  {formatDateToYMD(particularAssignment?.dueDate as string)}
                </div>
              </div>
            </div>
          </CardTitle>
        </CardHeader>
      </Card>

      {/* Associate Editor Corrections */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            {/* <History className="mr-2 h-5 w-5" /> */}
            Associate Editor Corrections
          </CardTitle>
        </CardHeader>
        <CardContent>
          {particularAssignment?.articleSubmissions?.associateEditorCorrections
            ?.length ? (
            <div className="space-y-3">
              {particularAssignment.articleSubmissions.associateEditorCorrections.map(
                (correction, index) => (
                  <div
                    key={index}
                    className="border rounded-lg p-4 bg-muted/50"
                  >
                    {/* Top Row: Badge + Date */}
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline">Correction #{index + 1}</Badge>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {new Date(correction.submittedAt).toLocaleDateString()}
                      </span>
                    </div>

                    {/* Message Section (if available) */}
                    {particularAssignment.message && (
                      <p className="text-sm text-muted-foreground mb-2">
                        {particularAssignment.message}
                      </p>
                    )}

                    {/* File Section */}
                    {correction.fileIds && correction.fileIds.length > 0 ? (
                      <div className="flex flex-col gap-2 mt-1">
                        {correction.fileIds.map((file, fileIndex) => (
                          <a
                            key={fileIndex}
                            href={file}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-primary underline break-all hover:text-primary/80 transition-colors"
                          >
                            View File {fileIndex + 1}
                          </a>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground italic">
                        No file uploaded for this correction.
                      </p>
                    )}
                  </div>
                )
              )}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground italic">
              No previous corrections available.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ParticularAssociateAssignment;
