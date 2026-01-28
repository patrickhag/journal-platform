'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, User, Calendar, SquarePen, File, Eye } from 'lucide-react';
import Link from 'next/link';
import { useGetAssociateEditorParticularAssignment } from '@/hooks/useReviews';
import { useParams, useRouter } from 'next/navigation';
import ReviewerAssignmentSkeleton from '@/components/ReviewerAssignmentSkeleton';
import { Badge } from '@/components/ui/badge';
import {
  formatAssignmentCorrectionsStatus,
  formatDateToYMD,
} from '@/lib/utils';
import { useState } from 'react';
import UploadCorrection from '../../components/UploadCorrection';
import ConditionalRender from '@/components/ConditionalRender';
import FileViewerModal from '@/components/FileViewerModal';

const ParticularAssociateAssignment = () => {
  const { assignmentId } = useParams();
  const [open, setOpen] = useState(false);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewerDoc, setViewerDoc] = useState<{
    uri: string;
    fileName?: string;
  } | null>(null);
  const router = useRouter();

  const { data: particularAssignment, isPending } =
    useGetAssociateEditorParticularAssignment(assignmentId as string);

  if (isPending) {
    return <ReviewerAssignmentSkeleton />;
  }

  const authorName = `${particularAssignment?.articleSubmissions.metadata.prefix}. ${particularAssignment?.articleSubmissions.user.firstName} ${particularAssignment?.articleSubmissions.user.lastName}`;

  const handleViewFile = (uri: string, fileName: string) => {
    setViewerDoc({ uri, fileName });
    setViewerOpen(true);
  };

  const handleViewerOpenChange = (open: boolean) => {
    setViewerOpen(open);
    if (!open) {
      setViewerDoc(null);
    }
  };

  return (
    <>
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button className="mb-4" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Back
          </Button>

          <ConditionalRender
            status={particularAssignment?.articleSubmissions.articleStatus}
            hideOn={['PUBLISHED', 'AWAITING DECISION', 'ACCEPTED']}
          >
            <Button
              type="submit"
              className="bg-primary hover:bg-primary/90"
              onClick={() => setOpen(true)}
            >
              <SquarePen className="mr-2 h-4 w-4" />
              Submit Correction
            </Button>
          </ConditionalRender>
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
            {particularAssignment?.articleSubmissions
              ?.associateEditorCorrections?.length ? (
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
                          <Badge variant="outline">
                            Correction #{index + 1}
                          </Badge>
                        </div>
                      </div>

                      {/* Message Section (if available) */}
                      <p className="text-sm text-muted-foreground mb-2">
                        <span className="font-medium">Comments:</span>{' '}
                        {correction.message ? (
                          <div
                            className="prose max-w-none"
                            dangerouslySetInnerHTML={{
                              __html: correction.message
                                .replace(/<pre><code class="language-json">/g, '')
                                .replace(/<\/code><\/pre>/g, ''),
                            }}
                          />
                        ) : (
                          <span className="italic text-muted-foreground">No correction comments available.</span>
                        )}
                      </p>

                      {/* File Section */}
                      <div className="flex items-center justify-between p-3 rounded-lg border bg-muted/30 hover:bg-muted/50 transition-colors mb-3">
                        <div className="flex items-center gap-3">
                          <File className="h-4 w-4 text-green-500" />
                          <div>
                            <h5 className="text-sm font-medium">
                              Correction file
                            </h5>
                          </div>
                        </div>

                        <Button
                          variant="ghost"
                          size="sm"
                          type="button"
                          onClick={() =>
                            handleViewFile(correction.fileId, 'Correction file')
                          }
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">
                          Submitted on:{' '}
                          {new Date(
                            correction.submittedAt
                          ).toLocaleDateString()}
                        </span>
                        <Badge>
                          {formatAssignmentCorrectionsStatus[correction.status]}
                        </Badge>
                      </div>
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
      {open && (
        <UploadCorrection
          open={open}
          setOpenSubmitCollection={setOpen}
          selectedAssignment={particularAssignment}
        />
      )}
      <FileViewerModal
        open={viewerOpen}
        onOpenChange={handleViewerOpenChange}
        documents={viewerDoc ? [viewerDoc] : []}
        title={viewerDoc?.fileName || 'Correction file'}
      />
    </>
  );
};

export default ParticularAssociateAssignment;
