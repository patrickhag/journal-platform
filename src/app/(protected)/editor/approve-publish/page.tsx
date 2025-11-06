'use client';

import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileText, Edit, SquareCheckBig } from 'lucide-react';
import { TPublishedArticle } from '@/types';
import { useGetPublishedArticles } from '@/hooks/usePublishArticle';
import { ApproveManuscriptDialog } from './components/ApproveManuscriptDialog';
import Link from 'next/link';
import EditPublishedManuscript from './components/EditPublishedManuscript';

const PublishedArticles = () => {
  const { data: publishedArticles, isPending } = useGetPublishedArticles();

  const [selectedPublishedArticle, setselectedPublishedArticle] =
    useState<TPublishedArticle | null>(null);
  const [editSheetOpen, setEditSheetOpen] = useState(false);
  const [acceptForPublication, setacceptForPublication] = useState<{
    open: boolean;
    articleId?: string;
  }>({
    open: false,
    articleId: '',
  });

  const onCloseAlert = () => setacceptForPublication({ open: false });

  return (
    <>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Publish Articles Management</h1>
        </div>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Published Articles
            </CardTitle>
            <CardDescription>
              Manage manuscripts that was published by associate editor.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {isPending && <p>Loading...</p>}

              {!isPending && publishedArticles?.length === 0 && (
                <p>No accepted manuscripts ready for publication.</p>
              )}

              {!isPending &&
                publishedArticles?.map((publishedArticle) => {
                  const authorNames = `${publishedArticle.article.metadata.prefix}. ${publishedArticle.article.user.firstName} ${publishedArticle.article.user.lastName}`;
                  return (
                    <div
                      key={publishedArticle.id}
                      className="border rounded-lg p-4 space-y-3"
                    >
                      <div className="flex justify-between items-start">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Link href={`/articles/${publishedArticle.id}`}>
                              <h3 className="font-semibold hover:underline">
                                {publishedArticle.article.metadata.title}
                              </h3>
                            </Link>
                            <Badge variant="default">
                              {publishedArticle.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            <strong>Author:</strong> {authorNames}
                          </p>
                          <div className="flex gap-4 text-sm text-muted-foreground">
                            <span>
                              <strong>DOI:</strong>{' '}
                              {publishedArticle.doi || 'Not assigned'}
                            </span>
                            <span>
                              <strong>Pages:</strong>{' '}
                              {publishedArticle.pageRange || 'Not set'}
                            </span>
                            <span>
                              <strong>Published:</strong>{' '}
                              {new Date(
                                publishedArticle.publishedAt
                              ).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-end gap-2">
                        {publishedArticle.status === 'AWAITING_DECISION' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setacceptForPublication({
                                open: true,
                                articleId: publishedArticle.id,
                              });
                            }}
                          >
                            <SquareCheckBig className="h-4 w-4 mr-2" />
                            Accept For Publication
                          </Button>
                        )}
                        {publishedArticle.status === 'PUBLISHED' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setselectedPublishedArticle(publishedArticle);
                              setEditSheetOpen(true);
                            }}
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Published Article
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })}
            </div>
          </CardContent>
        </Card>
      </div>
      {editSheetOpen && (
        <EditPublishedManuscript
          open={editSheetOpen}
          onOpenChange={setEditSheetOpen}
          publishedArticle={selectedPublishedArticle}
        />
      )}
      {acceptForPublication && (
        <ApproveManuscriptDialog
          open={acceptForPublication.open}
          onOpenChange={onCloseAlert}
          articleId={acceptForPublication.articleId as string}
        />
      )}
    </>
  );
};

export default PublishedArticles;
