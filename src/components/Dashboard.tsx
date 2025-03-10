'use client';

import { Tabs, TabsContent, TabsList } from '@/components/ui/tabs';
import { ArticleSection } from './ArticleSection';
import { SearchArticle } from './SearchArticle';
import { PlusCircle } from 'lucide-react';
import { Button } from './ui/button';
import Link from 'next/link';
import { ArticleFilters } from './ArticleFilters';
import { useGetArticles } from '@/hooks/useGetArticles';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { useDebounce } from '@/hooks/useDebounce';
import Loader from './Loader';

export default function DashboardPannel() {
  const { data: session } = useSession();
  const currentUser = session?.user;
  const userId = currentUser?.id as string;
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearchQuery = useDebounce(searchQuery, 500);
  const [selectedValue, setSelectedValue] = useState('');

  const { data: articles, isPending } = useGetArticles(
    userId,
    debouncedSearchQuery,
    selectedValue
  );

  return (
    <main className="max-w-5xl mx-auto">
      <div>
        <div className="mb-10">
          <h2 className="text-2xl text-[#141A26] font-medium">
            Welcome back, {currentUser?.name}
          </h2>
          <p className="text-muted-foreground">
            You&apos;ve got {articles?.length} submissions.
          </p>
        </div>

        <Tabs defaultValue="articles">
          <div className="flex justify-between">
            <TabsList className="w-full justify-start rounded-none border-b bg-transparent p-0">
              <ArticleFilters
                selectedValue={selectedValue}
                setSelectedValue={setSelectedValue}
              />
            </TabsList>
            <SearchArticle
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
            />
            <Button className="mx-5 bg-[#141A26]">
              <Link href="/articles/new/start">
                <span className="flex items-center gap-2">
                  <PlusCircle className="w-4 h-4" />
                  New article
                </span>
              </Link>
            </Button>
          </div>
          <TabsContent value="articles" className="mt-6">
            <div className="grid gap-4">
              {isPending ? (
                <div className="text-center text-muted-foreground">
                  <Loader text="Loading articles..." />
                </div>
              ) : articles && articles.length > 0 ? (
                articles.map((a, i) => (
                  <ArticleSection
                    article={{
                      'Comments for the editor': a.commentsForEditor || '',
                      commentsForEditor: a.commentsForEditor || '',
                      id: a.id || '',
                      requirements: [''],
                      section: a.section || 'Original Research',
                      title: a.title || '',
                      articleStatus: a.articleStatus || 'Submitted',
                      owner: a.owner,
                    }}
                    key={i}
                    index={i}
                  />
                ))
              ) : (
                <div className="text-center text-muted-foreground">
                  No articles submitted yet. Click &apos;New Article&apos; to
                  get started
                </div>
              )}
            </div>
          </TabsContent>
          <TabsContent value="archives" className="mt-6">
            <div className="text-center text-muted-foreground">
              No archived articles found.
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
