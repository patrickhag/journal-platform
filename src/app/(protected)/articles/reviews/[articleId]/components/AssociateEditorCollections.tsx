import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { File, Download, FileSearch2 } from 'lucide-react';
import { useGetAssociateEditorsCollections } from '@/hooks/useReviews';

export const AssociateEditorCollections = ({
  articleId,
}: {
  articleId: string;
}) => {
  const { data: collections, isPending } =
    useGetAssociateEditorsCollections(articleId);

  return (
    <Card>
      <CardHeader>
        <h1>Associate Editor Collections</h1>
      </CardHeader>
      <CardContent className="p-6">
        {isPending ? (
          <p className="text-muted-foreground">Loading...</p>
        ) : (
          <ScrollArea className="h-[600px] pr-4">
            <div className="space-y-6">
              {collections && collections.length > 0 ? (
                collections.map((review) => (
                  <Card key={review.id}>
                    <CardHeader>
                      <h3 className="font-semibold">
                        {review.user.firstName} {review.user.lastName}
                      </h3>
                    </CardHeader>
                    <CardContent>
                      {/* Annotated Files */}
                      {review.fileIds && review.fileIds.length > 0 && (
                        <div>
                          <h4 className="text-sm font-medium mb-3">
                            Annotated Files
                          </h4>
                          <div className="space-y-2">
                            {review.fileIds.map((fileUrl, idx) => (
                              <div
                                key={idx}
                                className="flex items-center justify-between p-3 rounded-lg border bg-muted/30 hover:bg-muted/50 transition-colors mb-3"
                              >
                                <div className="flex items-center gap-3">
                                  <File className="h-4 w-4 text-red-500" />
                                  <div>
                                    <h5 className="text-sm font-medium">
                                      File {idx + 1}
                                    </h5>
                                  </div>
                                </div>
                                <Button variant="ghost" size="sm" asChild>
                                  <a href={fileUrl} download>
                                    <Download className="h-4 w-4" />
                                  </a>
                                </Button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="mt-4 text-sm text-muted-foreground">
                        Submitted on: {review.submittedAt}
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center h-full pt-24 text-center text-muted-foreground">
                  <FileSearch2 className="w-12 h-12 mb-4 text-muted-foreground" />
                  <p className="text-sm">
                    No reviews have been submitted for this article yet.
                  </p>
                </div>
              )}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
};
