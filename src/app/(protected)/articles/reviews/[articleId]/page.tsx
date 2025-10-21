'use client';

import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  CheckSquare,
  ChevronLeft,
  Eye,
  File,
  FileSearch2,
  Repeat,
  UserCheck,
} from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useGetReviews } from '@/hooks/useReviews';
import { useState } from 'react';
import EditorDecisionModal from './components/EditorDecisionModal';
import EditorReReviewModal from './components/EditorReReview';
import Link from 'next/link';
import InviteAssociateEditorModal from './components/AssignAssociateEditor';
import { AssociateEditorCollections } from './components/AssociateEditorCollections';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function ReviewsPage() {
  const { articleId } = useParams();

  const { data: reviewData, isPending } = useGetReviews(articleId as string);
  const [openEditor, setOpenEditor] = useState(false);
  const [openAssignEditorDialog, setopenAssignEditorDialog] = useState(false);
  const [openRereview, setOpenRereview] = useState(false);
  const [reviewerUserId, setReviewerUserId] = useState('');
  const [reviewerName, setReviewerName] = useState('');
  const [revieweEmail, setReviewerEMail] = useState('');

  const reviewersName =
    reviewData?.user.firstName + ' ' + reviewData?.user.lastName;

  const router = useRouter();
  const onCloseRereview = () => setOpenRereview(false);
  const onCloseEditor = () => setOpenEditor(false);

  const handleReReviewRequest = (
    reviewId: string,
    reviewerName: string,
    formReviwerEmail: string
  ) => {
    setOpenRereview(true);
    setReviewerUserId(reviewId);
    setReviewerName(reviewerName);
    setReviewerEMail(formReviwerEmail);
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
              <TabsTrigger value="collections">
                Associate Collections
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
                              <Card key={review.id}>
                                <CardHeader>
                                  <div className="flex items-center justify-between">
                                    <div>
                                      <h3 className="font-semibold">
                                        {reviewerName}
                                      </h3>
                                    </div>
                                    <Badge>{review.status}</Badge>
                                  </div>
                                </CardHeader>
                                <CardContent>
                                  <p className="text-sm mb-4">
                                    {review.message}
                                  </p>
                                  {/* Annotated Files */}
                                  {review.fileIds &&
                                    review.fileIds.length > 0 && (
                                      <div className="mt-4">
                                        <h4 className="text-sm font-medium mb-3">
                                          Annotated Files
                                        </h4>
                                        <div className="space-y-2">
                                          {review.fileIds.map(
                                            (fileUrl, idx) => (
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
                                  <div className="flex items-center justify-between gap-2">
                                    <div className="mt-4 text-sm text-muted-foreground">
                                      Reviewed on: {review.reviewedAt}
                                    </div>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() =>
                                        handleReReviewRequest(
                                          review.userId,
                                          reviewersName,
                                          review.user.email
                                        )
                                      }
                                    >
                                      <Repeat />
                                      Request Re-Review
                                    </Button>
                                  </div>
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
            <TabsContent value="collections">
              <AssociateEditorCollections articleId={articleId as string} />
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
          reviewerId={reviewerUserId}
          reviewerName={reviewerName}
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
