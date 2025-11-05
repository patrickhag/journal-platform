'use client';

import { PlusCircle, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useGetUserArticles } from '@/hooks/useArticles';
import { useState, useEffect } from 'react';
import { useDebounce } from '@/hooks/useDebounce';
import { Input } from '@/components/ui/input';
import { ArticleSection } from '@/components/ArticleSection';
import { ArticleSkeleton } from '@/components/articles/ArticleSkeleton';
import { Skeleton } from '@/components/ui/skeleton';
import { Pagination, PaginationInfo } from '@/components/ui/pagination';

export default function Dashboard() {
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearchQuery = useDebounce(searchQuery, 500);
  const [selectedValue] = useState('UNDER REVIEW');
  const [page, setPage] = useState(1);
  const limit = 5;

  // 👇 Separate state to store header data (static)
  const [headerData, setHeaderData] = useState<{
    totalCount: number | null;
    initialized: boolean;
  }>({
    totalCount: null,
    initialized: false,
  });

  // ✅ Fetch all data as usual (this one updates during search)
  const {
    data: manuscriptsData,
    isPending,
    isFetching,
  } = useGetUserArticles(debouncedSearchQuery, selectedValue, page, limit);

  // Extract and safely handle data
  const articlesData = manuscriptsData?.data || manuscriptsData?.articles;
  const articles = Array.isArray(articlesData) ? articlesData : [];
  const pagination = manuscriptsData?.pagination;

  // Store total count once when the first data arrives
  useEffect(() => {
    if (!headerData.initialized && manuscriptsData) {
      const total =
        pagination?.total ??
        (Array.isArray(manuscriptsData?.data)
          ? manuscriptsData.data.length
          : 0);
      setHeaderData({ totalCount: total, initialized: true });
    }
  }, [manuscriptsData, pagination, headerData.initialized]);

  const isInitialLoad = isPending && !manuscriptsData;
  const safeArticles = Array.isArray(articles) ? articles : [];

  const hasValidPagination =
    pagination &&
    typeof pagination.totalPages === 'number' &&
    pagination.totalPages > 0 &&
    typeof pagination.page === 'number' &&
    typeof pagination.total === 'number' &&
    typeof pagination.limit === 'number';

  return (
    <div className="space-y-8">
      {/* ✅ Static Header */}
      <div className="space-y-2">
        {!headerData.initialized ? (
          <>
            <Skeleton className="h-7 w-48 rounded-md" />
            <Skeleton className="h-5 w-72 rounded-md" />
          </>
        ) : (
          <>
            <h2 className="text-2xl text-[#141A26] font-bold">
              Under Review Manuscripts
            </h2>
            {headerData.totalCount && headerData.totalCount > 0 ? (
              <p className="text-muted-foreground">
                You've got{' '}
                <span className="font-semibold">
                  {headerData.totalCount} under review manuscript
                  {headerData.totalCount === 1 ? '' : 's'}
                </span>
                .
              </p>
            ) : (
              <span>You don't have any under review manuscripts yet.</span>
            )}
          </>
        )}
      </div>

      {/* Controls - Only show when there are articles */}
      {headerData.totalCount && headerData.totalCount > 0 && (
        <div className="flex items-center justify-between gap-4 p-4 bg-card border border-border rounded-xl shadow-sm">
          {/* Search Box */}
          <div className="relative flex-1 max-w-2xl">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-background border-border w-full"
            />
          </div>

          {/* Submit Button */}
          <Button
            asChild
            className="bg-[#212c9e] hover:bg-[#1A237E] whitespace-nowrap"
          >
            <Link href="/author/article/new/start">
              <PlusCircle className="w-4 h-4 mr-2" />
              Submit New Article
            </Link>
          </Button>
        </div>
      )}

      {/* Articles Section */}
      <div className="grid gap-4">
        {isFetching && !isInitialLoad ? (
          <>
            {[1, 2, 3].map((_, i) => (
              <div className="mb-3" key={i}>
                <ArticleSkeleton />
              </div>
            ))}
          </>
        ) : safeArticles.length > 0 ? (
          <>
            <ArticleSection articles={safeArticles} />
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
          </>
        ) : (
          <div className="text-center py-12">
            <div className="bg-card border border-border rounded-xl p-8 max-w-md mx-auto">
              <p className="text-muted-foreground text-lg">
                No manuscript(s) found.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
