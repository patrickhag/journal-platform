import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { File, FileSearch2, Eye } from 'lucide-react';
import Link from 'next/link';
import { useGetAuthorCorrections } from '@/hooks/useArticles';
import { TAuthorCorrection } from '@/types';

export const AuthorCorrections = ({ articleId }: { articleId: string }) => {
  const { data: corrections, isPending } = useGetAuthorCorrections(articleId);
  console.log('corrections:', corrections);

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
                          {correction.message && (
                            <p className="text-sm">
                              <span className="font-semibold">
                                Author's comment:
                              </span>{' '}
                              {correction.message}
                            </p>
                          )}
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

                                      <Button variant="ghost" size="sm" asChild>
                                        <Link href={fileUrl} target="_blank">
                                          <Eye className="h-4 w-4" />
                                        </Link>
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
    </>
  );
};
