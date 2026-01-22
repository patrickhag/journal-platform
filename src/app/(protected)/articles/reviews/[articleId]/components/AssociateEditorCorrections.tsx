import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { File, FileSearch2, Eye } from 'lucide-react';
import { useGetAssociateEditorsCorrections } from '@/hooks/useReviews';
import ForwardFileModal from '@/components/articles/ForwardFileDialog';
import { AssociateEditorCorrectionStatusModal } from './RequestAssociateRecorrection';
import { formatAssignmentCorrectionsStatus } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import FileViewerModal from '@/components/FileViewerModal';
import { useState } from 'react';

export const AssociateEditorCorrections = ({
  articleId,
}: {
  articleId: string;
}) => {
  const { data: corrections, isPending } =
    useGetAssociateEditorsCorrections(articleId);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewerDoc, setViewerDoc] = useState<{
    uri: string;
    fileName?: string;
  } | null>(null);

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
      <Card>
        <CardHeader>
          <h1>Associate Editor Corrections</h1>
        </CardHeader>
        <CardContent className="p-6">
          {isPending ? (
            <p className="text-muted-foreground">Loading ...</p>
          ) : (
            <ScrollArea className="h-[600px] pr-4">
              <div className="space-y-6">
                {corrections && corrections.length > 0 ? (
                  corrections.map((correction) => {
                    const associateEditorName = `${correction.user.prefix ?? ''} ${correction.user.firstName} ${correction.user.lastName}`;
                    return (
                      <Card key={correction.id}>
                        <CardHeader>
                          <h3 className="font-semibold">
                            {associateEditorName}
                          </h3>
                        </CardHeader>
                        <CardContent>
                          {correction.message && (
                            <p className="text-sm text-muted-foreground mb-5">
                              <span className="font-medium">Comments:</span>{' '}
                              {correction.message}
                            </p>
                          )}
                          {/* Annotated Files */}
                          <div>
                            <div className="flex justify-between mb-2">
                              <h4 className="text-sm font-medium">
                                Annotated Files
                              </h4>
                              <Badge>
                                {
                                  formatAssignmentCorrectionsStatus[
                                    correction.status
                                  ]
                                }
                              </Badge>
                            </div>
                            <div className="space-y-2">
                              <div className="flex items-center justify-between p-3 rounded-lg border bg-muted/30 hover:bg-muted/50 transition-colors mb-3">
                                <div className="flex items-center gap-3">
                                  <File className="h-4 w-4 text-red-500" />
                                  <div>
                                    <h5 className="text-sm font-medium">
                                      Correction File
                                    </h5>
                                  </div>
                                </div>
                                <div className="flex justify-between">
                                  <Button variant="ghost" size="sm" asChild>
                                    <button
                                      type="button"
                                      onClick={() =>
                                        handleViewFile(
                                          correction.fileId,
                                          'Correction file'
                                        )
                                      }
                                    >
                                      <Eye className="h-4 w-4" />
                                    </button>
                                  </Button>
                                  <ForwardFileModal
                                    fileName={correction.fileId}
                                    articleId={articleId}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="flex justify-between mt-4 text-sm text-muted-foreground">
                            Submitted on: {correction.submittedAt}
                            <AssociateEditorCorrectionStatusModal
                              correctionId={correction.id}
                            />
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })
                ) : (
                  <div className="flex flex-col items-center justify-center h-full pt-24 text-center text-muted-foreground">
                    <FileSearch2 className="w-12 h-12 mb-4 text-muted-foreground" />
                    <p className="text-sm">
                      No corrections have been submitted for this manuscript
                      yet.
                    </p>
                  </div>
                )}
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>
      <FileViewerModal
        open={viewerOpen}
        onOpenChange={handleViewerOpenChange}
        documents={viewerDoc ? [viewerDoc] : []}
        title={viewerDoc?.fileName || 'Correction file'}
      />
    </>
  );
};
