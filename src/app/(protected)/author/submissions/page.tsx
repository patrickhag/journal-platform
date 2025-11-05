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
  const [selectedValue] = useState('SUBMITTED');
  const [page, setPage] = useState(1);
  const limit = 5;

  const [isMounted, setIsMounted] = useState(false);
  const [userHeaderData, setUserHeaderData] = useState<{
    userName: string | null;
    articleCount: number | null;
  }>({ userName: null, articleCount: null });

  // Mount check to avoid SSR mismatch
  useEffect(() => setIsMounted(true), []);

  // Fetch initial user info & article count once
  const { data: initialData } = useGetUserArticles('', selectedValue, 1, limit);
  useEffect(() => {
    if (initialData && !userHeaderData.userName) {
      const name = initialData?.userName || null;
      const count =
        initialData?.pagination?.total ?? initialData?.data?.length ?? 0;
      setUserHeaderData({ userName: name, articleCount: count });
    }
  }, [initialData, userHeaderData.userName]);

  // Fetch articles based on search & pagination
  const {
    data: manuscriptsData,
    isPending,
    isFetching,
  } = useGetUserArticles(debouncedSearchQuery, selectedValue, page, limit);

  const articles = manuscriptsData?.data || manuscriptsData?.articles || [];
  const pagination = manuscriptsData?.pagination;
  const hasValidPagination =
    pagination &&
    typeof pagination.totalPages === 'number' &&
    pagination.totalPages > 0;

  if (!isMounted) {
    return (
      <div className="space-y-8">
        <Skeleton className="h-7 w-48" />
        <Skeleton className="h-5 w-72" />
        {[1, 2, 3].map((_, i) => (
          <ArticleSkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* ✅ Header Section */}
      <div className="space-y-2">
        {userHeaderData.userName ? (
          <>
            <h2 className="text-2xl text-[#141A26] font-bold">
              Welcome back, {userHeaderData.userName}
            </h2>
            {userHeaderData.articleCount && userHeaderData.articleCount > 0 ? (
              <p className="text-muted-foreground">
                You've got{' '}
                <span className="font-semibold">
                  {userHeaderData.articleCount} manuscript
                  {userHeaderData.articleCount === 1 ? '' : 's'}
                </span>
                .
              </p>
            ) : (
              <p className="text-muted-foreground">
                You haven’t submitted any manuscripts yet.
              </p>
            )}
          </>
        ) : (
          <>
            <Skeleton className="h-7 w-48 rounded-md" />
            <Skeleton className="h-5 w-72 rounded-md" />
          </>
        )}
      </div>

      {/* Controls - only show if articles exist */}
      {userHeaderData.articleCount && userHeaderData.articleCount > 0 && (
        <div className="flex items-center justify-between gap-4 p-4 bg-card border border-border rounded-xl shadow-sm">
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

          <Button
            asChild
            className="bg-[#212c9e] hover:bg-[#1A237E] whitespace-nowrap"
          >
            <Link href="/author/new/start">
              <PlusCircle className="w-4 h-4 mr-2" />
              Submit New Article
            </Link>
          </Button>
        </div>
      )}

      {/* Articles Section */}
      <div className="grid gap-4">
        {isFetching || isPending ? (
          // Loading skeleton while fetching
          [1, 2, 3].map((_, i) => <ArticleSkeleton key={i} />)
        ) : Array.isArray(articles) && articles.length > 0 ? (
          <>
            <ArticleSection articles={articles} />
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
          // Only show empty state after loading is done
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
