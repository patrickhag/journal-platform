'use client';

import { ArticleSection } from './ArticleSection';
import { PlusCircle, Search } from 'lucide-react';
import { Button } from './ui/button';
import Link from 'next/link';
import { useGetUserArticles } from '@/hooks/useArticles';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { useDebounce } from '@/hooks/useDebounce';
import { ArticleSkeleton } from './articles/ArticleSkeleton';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { ARTICLE_STATUS } from '@/lib/consts';
import { Label } from './ui/label';

export default function DashboardPannel() {
  const { data: session } = useSession();
  const currentUser = session?.user;

  const userId = currentUser?.id as string;
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearchQuery = useDebounce(searchQuery, 500);
  const [selectedValue, setSelectedValue] = useState('');

  const { data: articles, isPending } = useGetUserArticles(
    userId,
    debouncedSearchQuery,
    selectedValue
  );

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="space-y-2">
        <h2 className="text-2xl text-[#141A26] font-bold">
          Welcome back, {currentUser?.name}
        </h2>
        {!isPending && (
          <p className="text-muted-foreground">
            {articles && articles.length > 0 ? (
              <>
                You’ve got{' '}
                <span className="font-semibold">
                  {articles.length} manuscript
                  {articles.length === 1 ? '' : 's'}
                </span>
                .
              </>
            ) : (
              'You haven’t submitted any manuscripts yet.'
            )}
          </p>
        )}
      </div>

      {/* Controls */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 p-6 bg-card border border-border rounded-xl shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 flex-1">
          <div className="flex items-center gap-3">
            <Label className="text-sm font-medium whitespace-nowrap">
              Filter by status:
            </Label>
            <Select
              onValueChange={(e) => setSelectedValue(e)}
              value={selectedValue}
            >
              <SelectTrigger className="w-[180px] bg-background border-border">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                {ARTICLE_STATUS.map((status) => (
                  <SelectItem value={status} key={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-background border-border"
            />
          </div>
        </div>

        <Button asChild className="bg-[#212c9e] hover:bg-[#1A237E]">
          <Link href="/articles/new/start">
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
        ) : articles && articles.length > 0 ? (
          <ArticleSection articles={articles} />
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
