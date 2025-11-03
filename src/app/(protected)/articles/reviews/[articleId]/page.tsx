'use client';

import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  CheckSquare,
  ChevronLeft,
  Eye,
  FileSearch2,
  FileText,
  Repeat,
  UserCheck,
  CornerDownRight,
} from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useGetReviews } from '@/hooks/useReviews';
import { useState } from 'react';
import EditorDecisionModal from './components/EditorDecisionModal';
import EditorReReviewModal from './components/EditorReReview';
import Link from 'next/link';
import InviteAssociateEditorModal from './components/AssignAssociateEditor';
import { AssociateEditorCorrections } from './components/AssociateEditorCorrections';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AuthorCorrections } from './components/AuthorCorrection';

export default function ReviewsPage() {
  const { articleId } = useParams();

  const { data: reviewData, isPending } = useGetReviews(articleId as string);

  const [openEditor, setOpenEditor] = useState(false);
  const [openAssignEditorDialog, setopenAssignEditorDialog] = useState(false);
  const [openRereview, setOpenRereview] = useState(false);
  const [reviewId, setReviewId] = useState('');
  const [reviewerName, setReviewerName] = useState('');
  const [revieweEmail, setReviewerEMail] = useState('');
  const [articleTitle, setArticleTitle] = useState('');

  const router = useRouter();
  const onCloseRereview = () => setOpenRereview(false);
  const onCloseEditor = () => setOpenEditor(false);

  const handleReReviewRequest = (
    reviewId: string,
    reviewerName: string,
    formReviwerEmail: string
  ) => {
    setOpenRereview(true);
    setReviewId(reviewId);
    setReviewerName(reviewerName);
    setReviewerEMail(formReviwerEmail);
    setArticleTitle(reviewData?.metadata.title as string);
  };

  return (
    <>
      <div className="container mx-auto py-6 max-w-7xl">
        <div className="flex justify-between gap-4 mb-6">
          <Button variant="link" size="sm" onClick={() => router.back()}>
            <ChevronLeft className="h-4 w-4 mr-2" />
            Go back
          </Button>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Article Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-5">
                <div>
                  <h3 className="font-medium">Title</h3>
                  <Link
                    href={`${process.env.NEXT_PUBLIC_URL}/articles/${articleId}`}
                  >
                    <p className="text-sm text-muted-foreground hover:underline line-clamp-1">
                      {reviewData?.metadata.title}
                    </p>
                  </Link>
                </div>
                <div>
                  <h3 className="font-medium">Author</h3>
                  <p>
                    {reviewData?.user.firstName +
                      ' ' +
                      reviewData?.user.lastName}
                  </p>
                </div>
                <div>
                  <h3 className="font-medium">Total Reviews</h3>
                  <div className="flex items-center gap-2 mt-2">
                    <FileSearch2 className="h-4 w-4" />
                    <span className="text-sm">
                      {reviewData?.reviews.length} Submitted Review(s)
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Tabs defaultValue="reviews">
            <TabsList>
              <TabsTrigger value="reviews">Reviewers Reviews</TabsTrigger>
              <TabsTrigger value="author-corrections">
                Author's Corrections
              </TabsTrigger>
              <TabsTrigger value="associate-corrections">
                Associate Editor Corrections
              </TabsTrigger>
            </TabsList>

            <TabsContent value="reviews">
              <Card>
                <CardHeader>
                  <h1>Submitted Reviews</h1>
                </CardHeader>
                <CardContent className="p-6">
                  {isPending ? (
                    <p className="text-muted-foreground">Loading ...</p>
                  ) : (
                    <ScrollArea className="h-[600px] pr-4">
                      <div className="space-y-6">
                        {reviewData && reviewData?.reviews?.length > 0 ? (
                          reviewData.reviews.map((review) => {
                            const reviewerName = `${review.user.prefix ?? ''} ${review.user.firstName} ${review.user.lastName}`;
                            return (
                              <Card key={review.id} className="text-sm">
                                <CardHeader className="pb-2">
                                  <div className="flex items-center justify-between">
                                    <div>
                                      <h3 className="font-medium">
                                        {reviewerName}
                                      </h3>
                                    </div>
                                    <Badge
                                      variant="secondary"
                                      className="text-xs"
                                    >
                                      {review.status}
                                    </Badge>
                                  </div>
                                </CardHeader>

                                <CardContent className="space-y-3 pb-4">
                                  <p className="text-muted-foreground">
                                    {review.message}
                                  </p>

                                  {/* Annotated Files */}
                                  {review.fileIds &&
                                    review.fileIds.length > 0 && (
                                      <div>
                                        <h4 className="text-xs font-medium mb-2">
                                          Annotated Files
                                        </h4>
                                        <div className="space-y-2">
                                          {review.fileIds.map(
                                            (fileUrl, idx) => (
                                              <div
                                                key={idx}
                                                className="flex items-center justify-between p-2 rounded-md border bg-muted/30 hover:bg-muted/50 transition-colors"
                                              >
                                                <div className="flex items-center gap-3">
                                                  <FileText className="h-4 w-4 text-green-500" />
                                                  <span className="text-xs font-medium">
                                                    File {idx + 1}
                                                  </span>
                                                </div>

                                                <Button
                                                  variant="ghost"
                                                  size="icon"
                                                  asChild
                                                >
                                                  <Link
                                                    href={fileUrl}
                                                    target="_blank"
                                                  >
                                                    <Eye className="h-4 w-4" />
                                                  </Link>
                                                </Button>
                                              </div>
                                            )
                                          )}
                                        </div>
                                      </div>
                                    )}

                                  {/* Reviewed Date + Request Re-review */}
                                  <div className="flex items-center justify-between pt-2">
                                    <p className="text-xs text-muted-foreground">
                                      Reviewed on: {review.reviewedAt}
                                    </p>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() =>
                                        handleReReviewRequest(
                                          review.userId,
                                          reviewerName,
                                          review.user.email
                                        )
                                      }
                                    >
                                      <Repeat className="h-4 w-4 mr-1" />
                                      Request Re-Review
                                    </Button>
                                  </div>

                                  {/* ============================== */}
                                  {/* Revision Info (staff editor)   */}
                                  {/* ============================== */}
                                  {review.reviewRevisions &&
                                    review.reviewRevisions.length > 0 && (
                                      <div className="mt-5 border-t border-muted pt-4 space-y-4">
                                        <div className="flex items-center gap-2">
                                          <CornerDownRight className="h-4 w-4 text-muted-foreground" />
                                          <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                            Requested Revisions
                                          </h4>
                                        </div>

                                        {review.reviewRevisions.map(
                                          (revision) => (
                                            <div
                                              key={revision.id}
                                              className="ml-6 p-4 rounded-lg border bg-muted/20"
                                            >
                                              <div className="flex gap-2 mb-2">
                                                <span className="font-medium text-sm">
                                                  Editor's Note:
                                                </span>{' '}
                                                <div
                                                  className="prose prose-gray text-sm max-w-none text-foreground leading-relaxed text-justify"
                                                  dangerouslySetInnerHTML={{
                                                    __html:
                                                      revision.message || '',
                                                  }}
                                                />
                                              </div>

                                              {/* Revision Files */}
                                              {revision.fileIds &&
                                                revision.fileIds.length > 0 && (
                                                  <div className="space-y-2 mt-2">
                                                    {revision.fileIds.map(
                                                      (fileUrl, idx) => (
                                                        <div
                                                          key={idx}
                                                          className="flex items-center justify-between p-2 rounded-md border bg-muted/30 hover:bg-muted/50 transition-colors"
                                                        >
                                                          <div className="flex items-center gap-3">
                                                            <FileText className="h-4 w-4 text-green-500" />
                                                            <span className="text-xs font-medium">
                                                              File {idx + 1}
                                                            </span>
                                                          </div>

                                                          <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            asChild
                                                          >
                                                            <Link
                                                              href={fileUrl}
                                                              target="_blank"
                                                            >
                                                              <Eye className="h-4 w-4" />
                                                            </Link>
                                                          </Button>
                                                        </div>
                                                      )
                                                    )}
                                                  </div>
                                                )}

                                              <p className="text-xs text-muted-foreground mt-3">
                                                Requested on:{' '}
                                                {revision.requestedAt}
                                              </p>
                                            </div>
                                          )
                                        )}
                                      </div>
                                    )}
                                </CardContent>
                              </Card>
                            );
                          })
                        ) : (
                          <div className="flex flex-col items-center justify-center h-full pt-24 text-center text-muted-foreground">
                            <FileSearch2 className="w-12 h-12 mb-4 text-muted-foreground" />
                            <p className="text-sm">
                              No reviews have been submitted for this manuscript
                              yet.
                            </p>
                          </div>
                        )}
                      </div>
                    </ScrollArea>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="associate-corrections">
              <AssociateEditorCorrections articleId={articleId as string} />
            </TabsContent>
            <TabsContent value="author-corrections">
              <AuthorCorrections articleId={articleId as string} />
            </TabsContent>
          </Tabs>
          <div className="w-10/12 mx-auto grid grid-cols-2 gap-2 mt-5">
            <Button
              className="bg-amber-600 hover:bg-amber-700"
              onClick={() => setOpenEditor(true)}
            >
              <CheckSquare className="mr-2 h-4 w-4" />
              Make Decision
            </Button>
            <Button
              className="bg-emerald-600 hover:bg-emerald-700"
              onClick={() => setopenAssignEditorDialog(true)}
            >
              <UserCheck className="mr-2 h-4 w-4" />
              Assign Associate Editor
            </Button>
          </div>
        </div>
      </div>
      {openEditor && (
        <EditorDecisionModal
          isOpen={openEditor}
          onClose={onCloseEditor}
          articleId={articleId as string}
        />
      )}

      {openRereview && (
        <EditorReReviewModal
          isOpen={openRereview}
          onClose={onCloseRereview}
          articleId={articleId as string}
          reviewId={reviewId}
          reviewerName={reviewerName}
          articleTitle={articleTitle}
          reviewerEmail={revieweEmail}
        />
      )}
      {openAssignEditorDialog && (
        <InviteAssociateEditorModal
          articleTitle={reviewData?.metadata.title as string}
          open={openAssignEditorDialog}
          setOpen={setopenAssignEditorDialog}
        />
      )}
    </>
  );
}
