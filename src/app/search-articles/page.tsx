'use client';

import { useState } from 'react';
import { Search as SearchIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useDebounce } from '@/hooks/useDebounce';
import { useGetSearchedArticles } from '@/hooks/useGetSearchedArticles';
import { SearchArticleCardSkeleton } from '@/components/skeletons/SearchArticleCardSkeleton';
import { format } from 'date-fns';

const Search = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  const { data: foundArticles = [], isPending } = useGetSearchedArticles({
    searchQuery: debouncedSearchQuery,
  });

  return (
    <>
      <div>
        {/* Main Search Area */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Search</h1>
          <p className="text-muted-foreground">
            Find articles, research papers, and publications
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative mb-8">
          <Input
            type="text"
            placeholder="Enter article title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-12 text-base pr-12 border-2 focus:border-academic-blue"
          />
          <Button
            size="icon"
            variant="default"
            className="absolute right-1 top-1 h-10 w-10"
          >
            <SearchIcon className="h-4 w-4" />
          </Button>
        </div>

        {/* Search Results */}
        <div className="">
          <h2 className="text-xl font-semibold text-foreground mb-6">
            Search Results
          </h2>
          {searchQuery.trim() === '' && (
            <p className="text-muted-foreground italic">
              Search results will appear here.
            </p>
          )}
          {isPending && <SearchArticleCardSkeleton count={3} />}

          {!isPending &&
            foundArticles.length === 0 &&
            searchQuery.trim() !== '' && (
              <p className="text-muted-foreground italic">
                No articles found matching "{searchQuery}".
              </p>
            )}
          {foundArticles?.map((result) => {
            const articleData = result?.article;

            const author = {
              name: `${articleData?.user.firstName} ${articleData?.user.lastName}`,
            };

            const contributors = articleData
              ? [author, ...articleData.contributors]
              : [];

            return (
              <Link href={`/articles/article/${result.slug}`} target="_blank">
                <div
                  key={result.id}
                  className="bg-card border border-border rounded-lg p-4 hover:shadow-md transition-shadow mb-3"
                >
                  <h3 className="text-lg font-medium hover:text-blue-600 cursor-pointer mb-2 line-clamp-1">
                    {result.article.metadata.title}
                  </h3>
                  <div className="flex items-center space-x-2 text-muted-foreground mb-2">
                    {contributors.map((contributor, index) => (
                      <span key={index}>
                        {contributor.name}
                        {contributors.indexOf(contributor) !==
                          contributors.length - 1 && ','}
                      </span>
                    ))}
                    <span>•</span>
                    <span className="text-sm text-muted-foreground">
                      {format(
                        new Date(result?.publishedAt as string),
                        'MMMM d, yyyy'
                      )}
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default Search;
