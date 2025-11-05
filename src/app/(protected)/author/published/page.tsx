'use client';

import { PlusCircle, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useGetUserArticles } from '@/hooks/useArticles';
import { useState } from 'react';
import { useDebounce } from '@/hooks/useDebounce';
import { Input } from '@/components/ui/input';
import { ArticleSection } from '@/components/ArticleSection';
import { ArticleSkeleton } from '@/components/articles/ArticleSkeleton';
import { Skeleton } from '@/components/ui/skeleton';
import { Pagination, PaginationInfo } from '@/components/ui/pagination';
import Loader from '@/components/Loader';

export default function Dashboard() {
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearchQuery = useDebounce(searchQuery, 500);
  const [selectedValue] = useState('PUBLISHED');
  const [page, setPage] = useState(1);
  const limit = 5;

  const {
    data: manuscriptsData,
    isPending,
    isFetching,
  } = useGetUserArticles(debouncedSearchQuery, selectedValue, page, limit);

  // Extract articles, pagination, and userName from the response
  // Handle both paginated and non-paginated responses
  const articlesData = manuscriptsData?.data || manuscriptsData?.articles;
  const articles = Array.isArray(articlesData) ? articlesData : [];
  const pagination = manuscriptsData?.pagination;

  // Determine if this is initial load (no data yet)
  const isInitialLoad = isPending && !manuscriptsData;

  // Safe articles array - always ensure it's an array
  const safeArticles = Array.isArray(articles) ? articles : [];

  // Ensure pagination exists and has valid values before rendering
  const hasValidPagination =
    pagination &&
    typeof pagination.totalPages === 'number' &&
    pagination.totalPages > 0 &&
    typeof pagination.page === 'number' &&
    typeof pagination.total === 'number' &&
    typeof pagination.limit === 'number';

  return (
    <div className="space-y-8">
      {/* Header Section - Only show skeleton on initial load */}
      <div className="space-y-2">
        {isInitialLoad ? (
          <>
            {/* Skeleton placeholders */}
            <Skeleton className="h-7 w-48 rounded-md" />
            <Skeleton className="h-5 w-72 rounded-md" />
          </>
        ) : (
          <>
            <h2 className="text-2xl text-[#141A26] font-bold">
              Published Manuscripts
            </h2>
            {safeArticles.length > 0 ? (
              <p className="text-muted-foreground">
                You've got{' '}
                <span className="font-semibold">
                  {safeArticles.length} published manuscript
                  {safeArticles.length === 1 ? '' : 's'}
                </span>
                .
              </p>
            ) : (
              <span>0 manuscripts found.</span>
            )}
          </>
        )}
      </div>

      {/* Controls - Only show when there are articles */}
      {(pagination?.total && pagination.total > 0) ||
      (Array.isArray(articles) && articles.length > 0) ? (
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
      ) : null}

      {/* Articles Section */}
      <div className="grid gap-4">
        {isPending ? (
          <>
            {/* Show loading message when initially loading */}
            <div className="flex justify-center items-center py-12">
              <div className="bg-card border border-border rounded-xl p-8 max-w-md mx-auto">
                <Loader text="Please wait, loading manuscripts and articles..." />
              </div>
            </div>
          </>
        ) : isFetching && !isInitialLoad ? (
          <>
            {/* Show loading message when fetching new data (search/pagination) */}
            <div className="flex justify-center items-center py-8">
              <Loader text="Please wait, loading..." />
            </div>
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
                0 manuscript(s) found.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
