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

export default function Dashboard() {
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearchQuery = useDebounce(searchQuery, 500);
  const [selectedValue] = useState('SUBMITTED');

  const { data: manuscripts, isPending } = useGetUserArticles(
    debouncedSearchQuery,
    selectedValue
  );

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="space-y-2">
        {isPending ? (
          <>
            {/* Skeleton placeholders */}
            <Skeleton className="h-7 w-48 rounded-md" />
            <Skeleton className="h-5 w-72 rounded-md" />
          </>
        ) : manuscripts ? (
          <>
            <h2 className="text-2xl text-[#141A26] font-bold">
              Welcome back, {manuscripts?.userName}
            </h2>
            {manuscripts.articles.length > 0 ? (
              <p className="text-muted-foreground">
                You’ve got{' '}
                <span className="font-semibold">
                  {manuscripts.articles.length} manuscript
                  {manuscripts.articles.length === 1 ? '' : 's'}
                </span>
                .
              </p>
            ) : (
              <span>You haven’t submitted any manuscripts yet.</span>
            )}
          </>
        ) : null}
      </div>

      {/* Controls */}
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
        <Button
          asChild
          className="bg-[#212c9e] hover:bg-[#1A237E] whitespace-nowrap"
        >
          <Link href="/author/new-manuscript">
            <PlusCircle className="w-4 h-4 mr-2" />
            Submit New Article
          </Link>
        </Button>
      </div>

      {/* Articles Section */}
      <div className="grid gap-4">
        {isPending ? (
          <>
            {[1, 2, 3].map((_, i) => (
              <div className="mb-3" key={i}>
                <ArticleSkeleton />
              </div>
            ))}
          </>
        ) : manuscripts?.articles && manuscripts.articles.length > 0 ? (
          <ArticleSection articles={manuscripts.articles} />
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
