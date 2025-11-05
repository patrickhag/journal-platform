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
import { Pagination, PaginationInfo } from '@/components/ui/pagination';
import { Skeleton } from '@/components/ui/skeleton';

export default function PublishedArticles() {
  const [page, setPage] = useState(1);
  const limit = 5;

  const {
    data: publishedData,
    isPending,
    isFetching,
  } = useGetPublishedArticles(page, limit);

  // Handle both paginated and non-paginated responses
  const articlesData =
    publishedData?.data || publishedData?.articles || publishedData;
  const publishedArticles = Array.isArray(articlesData) ? articlesData : [];
  const pagination = publishedData?.pagination;

  // Check pagination validity
  const hasValidPagination =
    pagination &&
    typeof pagination.totalPages === 'number' &&
    pagination.totalPages > 0 &&
    typeof pagination.page === 'number' &&
    typeof pagination.total === 'number' &&
    typeof pagination.limit === 'number';

  // Dialog & Sheet states
  const [selectedPublishedArticle, setSelectedPublishedArticle] =
    useState<TPublishedArticle | null>(null);
  const [editSheetOpen, setEditSheetOpen] = useState(false);
  const [approveDialog, setApproveDialog] = useState<{
    open: boolean;
    articleId?: string;
  }>({
    open: false,
    articleId: '',
  });

  const onCloseAlert = () => setApproveDialog({ open: false });

  // Determine if this is initial load
  const isInitialLoad = isPending && !publishedData;

  return (
    <>
      <div className="space-y-8">
        {/* Header Section - stays visible always */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-[#141A26]">
            Publish Articles Management
          </h1>
          <p className="text-muted-foreground">
            Manage manuscripts that were published by the associate editor.
          </p>
        </div>

        {/* Card Container */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Published Articles
            </CardTitle>
            <CardDescription>
              View, approve, or edit published manuscripts.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div className="space-y-4">
              {/* Initial Loading */}
              {isInitialLoad && (
                <>
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-24 w-full rounded-lg" />
                  ))}
                </>
              )}

              {/* Re-fetching Skeletons (pagination/search) */}
              {isFetching && !isInitialLoad && (
                <>
                  {[1, 2].map((i) => (
                    <Skeleton key={i} className="h-24 w-full rounded-lg" />
                  ))}
                </>
              )}

              {/* Empty State */}
              {!isPending && publishedArticles.length === 0 && (
                <div className="text-center py-12">
                  <div className="bg-card border border-border rounded-xl p-8 max-w-md mx-auto">
                    <p className="text-muted-foreground text-lg">
                      No published manuscripts found.
                    </p>
                  </div>
                </div>
              )}

              {/* Articles List */}
              {!isPending &&
                publishedArticles.map((article) => {
                  const authorNames = `${article.article.metadata.prefix}. ${article.article.user.firstName} ${article.article.user.lastName}`;
                  return (
                    <div
                      key={article.id}
                      className="border border-border rounded-lg p-4 space-y-3 bg-background shadow-sm"
                    >
                      <div className="flex justify-between items-start">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Link href={`/articles/${article.id}`}>
                              <h3 className="font-semibold hover:underline text-[#141A26]">
                                {article.article.metadata.title}
                              </h3>
                            </Link>
                            <Badge>{article.status}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            <strong>Author:</strong> {authorNames}
                          </p>
                          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                            <span>
                              <strong>DOI:</strong>{' '}
                              {article.doi || 'Not assigned'}
                            </span>
                            <span>
                              <strong>Pages:</strong>{' '}
                              {article.pageRange || 'Not set'}
                            </span>
                            <span>
                              <strong>Published:</strong>{' '}
                              {new Date(
                                article.publishedAt
                              ).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex justify-end gap-2">
                        {article.status === 'AWAITING_DECISION' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              setApproveDialog({
                                open: true,
                                articleId: article.id,
                              })
                            }
                          >
                            <SquareCheckBig className="h-4 w-4 mr-2" />
                            Accept For Publication
                          </Button>
                        )}
                        {article.status === 'PUBLISHED' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedPublishedArticle(article);
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

            {/* Pagination */}
            {hasValidPagination && pagination.total > 5 && (
              <div className="mt-6 flex items-center justify-between">
                <PaginationInfo
                  currentPage={pagination.page}
                  totalPages={pagination.totalPages}
                  totalItems={pagination.total}
                  itemsPerPage={pagination.limit}
                />
                <Pagination
                  page={pagination.page}
                  totalPages={pagination.totalPages}
                  onPageChange={setPage}
                />
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Dialogs / Modals */}
      {editSheetOpen && (
        <EditPublishedManuscript
          open={editSheetOpen}
          onOpenChange={setEditSheetOpen}
          publishedArticle={selectedPublishedArticle}
        />
      )}

      {approveDialog.open && (
        <ApproveManuscriptDialog
          open={approveDialog.open}
          onOpenChange={onCloseAlert}
          articleId={approveDialog.articleId as string}
        />
      )}
    </>
  );
}
