import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { File, FileSearch2, Eye } from 'lucide-react';
import { useGetAuthorCorrections } from '@/hooks/useArticles';
import { TAuthorCorrection } from '@/types';
import FileViewerModal from '@/components/FileViewerModal';
import { useState } from 'react';

export const AuthorCorrections = ({ articleId }: { articleId: string }) => {
  const { data: corrections, isPending } = useGetAuthorCorrections(articleId);
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
          <h1>Author's Corrections</h1>
        </CardHeader>
        <CardContent className="p-6">
          {isPending ? (
            <p className="text-muted-foreground">Loading ...</p>
          ) : (
            <ScrollArea className="h-[600px] pr-4">
              <div className="space-y-6">
                {corrections && corrections?.length > 0 ? (
                  corrections.map((correction: TAuthorCorrection) => {
                    return (
                      <Card key={correction.id}>
                        <CardContent className="mt-6">
                        <h4 className="font-semibold mb-2 text-muted-foreground">
                                    Author's Comments
                                  </h4>
                                  <div
                                    className="prose max-w-none"
                                    dangerouslySetInnerHTML={{
                                      __html: correction.message
                                        .replace(/<pre><code class="language-json">/g, '')
                                        .replace(/<\/code><\/pre>/g, ''),
                                    }}
                                  />
                          {/* Annotated Files */}
                          {correction.fileIds &&
                            correction.fileIds.length > 0 && (
                              <div className="my-4">
                                <h4 className="text-sm font-medium mb-3">
                                  Annotated Files
                                </h4>
                                <div className="space-y-2">
                                  {correction.fileIds.map((fileUrl, idx) => (
                                    <div
                                      key={idx}
                                      className="flex items-center justify-between p-3 rounded-lg border bg-muted/30 hover:bg-muted/50 transition-colors mb-3"
                                    >
                                      <div className="flex items-center gap-3">
                                        <File className="h-4 w-4 text-green-500" />
                                        <div>
                                          <h5 className="text-sm font-medium">
                                            File {idx + 1}
                                          </h5>
                                        </div>
                                      </div>

                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        type="button"
                                        onClick={() =>
                                          handleViewFile(
                                            fileUrl,
                                            `Author file ${idx + 1}`
                                          )
                                        }
                                      >
                                        <Eye className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          <div className="flex items-center justify-between gap-2">
                            <div className="mt-4 text-sm text-muted-foreground">
                              <span className="font-semibold">
                                Submitted on:
                              </span>{' '}
                              {new Date(
                                correction.submittedAt
                              ).toLocaleDateString()}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })
                ) : (
                  <div className="flex flex-col items-center justify-center h-full pt-24 text-center text-muted-foreground">
                    <FileSearch2 className="w-12 h-12 mb-4 text-muted-foreground" />
                    <p className="text-sm">
                      No author corrections have been submitted for this
                      manuscript yet.
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
        title={viewerDoc?.fileName || 'Author file'}
      />
    </>
  );
};
