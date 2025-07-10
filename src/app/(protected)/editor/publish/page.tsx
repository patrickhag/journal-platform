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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, Plus, Edit, Ban } from 'lucide-react';
import { useGetAcceptedArticles } from '@/hooks/useArticles';
import { TPublishedArticle } from '@/types';
import { useGetPublishedArticles } from '@/hooks/usePublishArticle';
import PublishManuscriptSheet from './components/PublishManuscript';
import Link from 'next/link';
import EditPublishedManuscript from './components/EditPublishedManuscript';

const PublishedArticles = () => {
  const [sheetOpen, setSheetOpen] = useState<{
    open: boolean;
    articleId?: string;
    articleTitle?: string;
  }>({
    open: false,
    articleId: '',
    articleTitle: '',
  });
  const { data: acceptedManuscripts, isPending } = useGetAcceptedArticles();

  const { data: publishedArticles } = useGetPublishedArticles();

  const [selectedPublishedArticle, setselectedPublishedArticle] =
    useState<TPublishedArticle | null>(null);
  const [editSheetOpen, setEditSheetOpen] = useState(false);

  const handlePublishManuscript = (articleId: string, articleTitle: string) => {
    setSheetOpen({ open: true, articleId, articleTitle });
  };

  const onClose = () => setSheetOpen({ open: false });

  return (
    <>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Publish Articles Management</h1>
        </div>

        <Tabs defaultValue="accepted" className="space-y-4">
          <TabsList>
            <TabsTrigger value="accepted">Accepted Manuscripts</TabsTrigger>
            <TabsTrigger value="published">Published Articles</TabsTrigger>
          </TabsList>

          <TabsContent value="accepted" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Accepted Manuscripts Ready for Publication
                </CardTitle>
                <CardDescription>
                  These manuscripts have been accepted and are ready to be
                  published
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {acceptedManuscripts?.map((manuscript) => {
                    const authorNames = `${manuscript.metadata.prefix}. ${manuscript.user.firstName} ${manuscript.user.lastName}`;
                    return (
                      <div
                        key={manuscript.id}
                        className="border rounded-lg p-4 space-y-3"
                      >
                        <div className="flex justify-between items-start">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <Link href={`/articles/${manuscript.id}`}>
                                <h3 className="font-semibold cursor-pointer hover:underline">
                                  {manuscript.metadata.title}
                                </h3>
                              </Link>
                              <Badge variant="secondary">
                                {manuscript.articleStatus}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              <strong>Author:</strong> {authorNames}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              <strong>Accepted:</strong> {manuscript.acceptedAt}
                            </p>
                            <div
                              className="prose max-w-none line-clamp-2 text-sm"
                              dangerouslySetInnerHTML={{
                                __html: manuscript.metadata.abstract,
                              }}
                            />
                          </div>
                        </div>

                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              handlePublishManuscript(
                                manuscript.id,
                                manuscript.metadata.title
                              )
                            }
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Publish Manuscript
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
                {acceptedManuscripts?.length === 0 && (
                  <p>No accepted manuscripts found.</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="published" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Published Articles
                </CardTitle>
                <CardDescription>
                  Manage your published articles
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {publishedArticles?.map((publishedArticle) => {
                    const authorNames = `${publishedArticle.article.metadata.prefix}. ${publishedArticle.article.user.firstName} ${publishedArticle.article.user.lastName}`;
                    return (
                      <div
                        key={publishedArticle.id}
                        className="border rounded-lg p-4 space-y-3"
                      >
                        <div className="flex justify-between items-start">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold">
                                {publishedArticle.article.metadata.title}
                              </h3>
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
                        </div>
                      </div>
                    );
                  })}
                </div>
                {publishedArticles?.length === 0 && (
                  <p>No published articles found.</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      {sheetOpen.open && (
        <PublishManuscriptSheet
          articleId={sheetOpen.articleId as string}
          open={sheetOpen.open}
          onOpenChange={onClose}
          title={sheetOpen.articleTitle as string}
        />
      )}
      {editSheetOpen && (
        <EditPublishedManuscript
          open={editSheetOpen}
          onOpenChange={setEditSheetOpen}
          publishedArticle={selectedPublishedArticle}
        />
      )}
    </>
  );
};

export default PublishedArticles;
