'use client';

import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileText, Edit, SquareCheckBig } from 'lucide-react';
import { TPublishedArticle } from '@/types';
import { useGetPublishedArticles } from '@/hooks/usePublishArticle';
import Link from 'next/link';
import ApproveManuscriptSheet from './components/ApproveManuscriptSheet';
import EditPublishedManuscript from './components/EditPublishedManuscript';

const ManagePublishedArticles = () => {
  const { data: publishedArticles, isPending: publishedPending } =
    useGetPublishedArticles('PUBLISHED');
  const { data: unpublishedArticles, isPending: unpublishedPending } =
    useGetPublishedArticles('UNPUBLISHED');
  const { data: awaitingArticles, isPending: awaitingPending } =
    useGetPublishedArticles('AWAITING DECISION');

  const [selectedPublishedArticle, setSelectedPublishedArticle] =
    useState<TPublishedArticle | null>(null);
  const [editSheetOpen, setEditSheetOpen] = useState(false);
  const [selectedAwaitingArticle, setSelectedAwaitingArticle] =
    useState<TPublishedArticle | null>(null);
  const [approveSheetOpen, setApproveSheetOpen] = useState(false);

  const renderArticles = (
    articles: TPublishedArticle[] | undefined,
    emptyMessage: string
  ) => {
    if (!articles?.length) {
      return <p className="text-sm text-muted-foreground">{emptyMessage}</p>;
    }

    return articles.map((publishedArticle) => {
      const authorNames = `${publishedArticle.article.metadata.prefix}. ${publishedArticle.article.user.firstName} ${publishedArticle.article.user.lastName}`;
      const displayDate = publishedArticle.publishedAt
        ? new Date(publishedArticle.publishedAt).toLocaleDateString()
        : 'Not set';

      return (
        <div
          key={publishedArticle.id}
          className="border rounded-lg p-4 space-y-3"
        >
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Link
                  href={`/articles/article/${publishedArticle.slug}`}
                  target="_blank"
                >
                  <h3 className="font-semibold hover:underline">
                    {publishedArticle.article.metadata.title}
                  </h3>
                </Link>
                <Badge variant="default">{publishedArticle.status}</Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                <strong>Author:</strong> {authorNames}
              </p>
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                <span>
                  <strong>DOI:</strong> {publishedArticle.doi || 'Not assigned'}
                </span>
                <span>
                  <strong>Pages:</strong>{' '}
                  {publishedArticle.pageRange || 'Not set'}
                </span>
                <span>
                  <strong>Date:</strong> {displayDate}
                </span>
                <span>
                  <strong>Issue:</strong> {publishedArticle.issue.issueNumber},{' '}
                  {publishedArticle.issue.volume.year}
                </span>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSelectedPublishedArticle(publishedArticle);
                setEditSheetOpen(true);
              }}
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit Article
            </Button>
          </div>
        </div>
      );
    });
  };

  const renderAwaitingArticles = () => {
    if (awaitingPending) {
      return <p>Loading awaiting decision articles...</p>;
    }

    if (!awaitingArticles?.length) {
      return (
        <p className="text-sm text-muted-foreground">
          No manuscripts awaiting decision.
        </p>
      );
    }

    return awaitingArticles.map((awaitingArticle) => {
      const authorNames = `${awaitingArticle.article.metadata.prefix}. ${awaitingArticle.article.user.firstName} ${awaitingArticle.article.user.lastName}`;
      return (
        <div
          key={awaitingArticle.id}
          className="border rounded-lg p-4 space-y-3"
        >
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Link href={`/articles/${awaitingArticle.article.id}`}>
                  <h3 className="font-semibold hover:underline">
                    {awaitingArticle.article.metadata.title}
                  </h3>
                </Link>
                <Badge variant="default">{awaitingArticle.status}</Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                <strong>Author:</strong> {authorNames}
              </p>
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                <span>
                  <strong>DOI:</strong> {awaitingArticle.doi || 'Not assigned'}
                </span>
                <span>
                  <strong>Pages:</strong>{' '}
                  {awaitingArticle.pageRange || 'Not set'}
                </span>
                <span>
                  <strong>Submitted:</strong>{' '}
                  {new Date(awaitingArticle.publishedAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSelectedAwaitingArticle(awaitingArticle);
                setApproveSheetOpen(true);
              }}
            >
              <SquareCheckBig className="h-4 w-4 mr-2" />
              Accept For Publication
            </Button>
          </div>
        </div>
      );
    });
  };

  return (
    <>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">
            Modify Published, Unpublished and Awaiting decision Articles
          </h1>
        </div>
        <Tabs defaultValue="awaiting" className="w-full">
          <TabsList>
            <TabsTrigger value="awaiting">Awaiting Decision</TabsTrigger>
            <TabsTrigger value="published">Published</TabsTrigger>
            <TabsTrigger value="unpublished">Unpublished</TabsTrigger>
          </TabsList>
          <TabsContent value="published">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Published Articles{' '}
                  {publishedArticles && `(${publishedArticles?.length})`}
                </CardTitle>
                <CardDescription>
                  Manage and edit manuscripts that have been published.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {publishedPending && <p>Loading published articles...</p>}
                  {!publishedPending &&
                    renderArticles(
                      publishedArticles,
                      'No published articles found.'
                    )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="unpublished">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Unpublished Articles{' '}
                  {unpublishedArticles && `(${unpublishedArticles?.length})`}
                </CardTitle>
                <CardDescription>
                  Review manuscripts that are currently unpublished and make
                  updates before republishing.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {unpublishedPending && <p>Loading unpublished articles...</p>}
                  {!unpublishedPending &&
                    renderArticles(
                      unpublishedArticles,
                      'No unpublished articles found.'
                    )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="awaiting">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Articles Awaiting Decision
                  {awaitingArticles && `(${awaitingArticles?.length})`}
                </CardTitle>
                <CardDescription>
                  Review and approve manuscripts that are ready for publication.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">{renderAwaitingArticles()}</div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      {editSheetOpen && (
        <EditPublishedManuscript
          open={editSheetOpen}
          onOpenChange={setEditSheetOpen}
          publishedArticle={selectedPublishedArticle}
        />
      )}
      {approveSheetOpen && (
        <ApproveManuscriptSheet
          open={approveSheetOpen}
          onOpenChange={setApproveSheetOpen}
          publishedArticle={selectedAwaitingArticle}
        />
      )}
    </>
  );
};

export default ManagePublishedArticles;
