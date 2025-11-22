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
import { FileText, Edit } from 'lucide-react';
import { TPublishedArticle } from '@/types';
import { useGetPublishedArticles } from '@/hooks/usePublishArticle';
import Link from 'next/link';
import EditPublishedManuscript from '../approve-publish/components/EditPublishedManuscript';

const ManagePublishedArticles = () => {
  const { data: publishedArticles, isPending } =
    useGetPublishedArticles('PUBLISHED');

  const [selectedPublishedArticle, setSelectedPublishedArticle] =
    useState<TPublishedArticle | null>(null);
  const [editSheetOpen, setEditSheetOpen] = useState(false);

  return (
    <>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Manage Published Articles</h1>
        </div>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Published Articles
            </CardTitle>
            <CardDescription>
              Manage and edit manuscripts that have been published.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {isPending && <p>Loading...</p>}

              {!isPending && publishedArticles?.length === 0 && (
                <p>No published articles found.</p>
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
                            <Link
                              href={`/articles/article/${publishedArticle.slug}`}
                              target="_blank"
                            >
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
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedPublishedArticle(publishedArticle);
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
    </>
  );
};

export default ManagePublishedArticles;
