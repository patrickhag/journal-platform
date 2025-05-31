'use client';

import { Tabs, TabsContent, TabsList } from '@/components/ui/tabs';
import { ArticleSection } from './ArticleSection';
import { PlusCircle } from 'lucide-react';
import { Button } from './ui/button';
import Link from 'next/link';
import { ArticleFilters } from './ArticleFilters';
import { useGetUserArticles } from '@/hooks/useArticles';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { useDebounce } from '@/hooks/useDebounce';
import { ArticleSkeleton } from './articles/ArticleSkeleton';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import withPermissions from './WithPermission';

export default function DashboardPannel() {
  const { data: session } = useSession();
  const currentUser = session?.user;
  const currentUserRole = session?.user.role;
  const userId = currentUser?.id as string;
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearchQuery = useDebounce(searchQuery, 500);
  const [selectedValue, setSelectedValue] = useState('');
  const [selectedType, setSelectedType] = useState(
    currentUser?.role === 'REVIEWER' || currentUser?.role === 'CHIEF_EDITOR'
      ? 'Assigned to review'
      : 'My articles'
  );

  const { data: articles, isPending } = useGetUserArticles(
    userId,
    debouncedSearchQuery,
    selectedValue,
    selectedType
  );

  return (
    <div>
      <div className="mb-10">
        <h2 className="text-2xl text-[#141A26] font-bold">
          Welcome back, {currentUser?.name}
        </h2>
        <p className="text-muted-foreground">
          You&apos;ve got{' '}
          {selectedType === 'My articles' ? (
            <span>
              {articles?.length} submission{articles?.length === 1 ? '' : 's'}
            </span>
          ) : (
            <span>
              {articles?.length} article{articles?.length === 1 ? '' : 's'}{' '}
              assigned to you
            </span>
          )}
        </p>
      </div>

      <Tabs defaultValue="articles">
        <div className="flex justify-between">
          <TabsList className="w-full justify-start rounded-none border-b bg-transparent p-0">
            <ArticleFilters
              selectedValue={selectedValue}
              setSelectedValue={setSelectedValue}
              selectedType={selectedType}
              setSelectedType={setSelectedType}
            />
          </TabsList>

          <div className="relative w-72">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
              disabled={articles?.length === 0}
            />
          </div>

          <CreateArticleButtonWithPermission
            requiredPermissions={['CREATE_ARTICLE']}
            role={
              currentUserRole as
                | 'NORMAL_USER'
                | 'CHIEF_EDITOR'
                | 'ADMIN'
                | 'REVIEWER'
            }
            fallback={<></>}
          />
        </div>
        <TabsContent value="articles" className="mt-6">
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
              articles.map((a, i) => (
                <ArticleSection
                  article={{
                    id: a.id || '',
                    section: a.section || 'Original Research',
                    title: a.title || '',
                    articleStatus: a.articleStatus || 'SUBMITTED',
                    proofStatus: a.proofStatus,
                  }}
                  key={i}
                  index={i}
                />
              ))
            ) : (
              <div className="text-center text-muted-foreground">
                No articles{' '}
                {selectedType === 'My articles'
                  ? 'submitted'
                  : 'assigned to you'}{' '}
                yet. Click &apos;New Article&apos; to get started
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
  );
}

const CreateArticleButton = () => (
  <Button className="mx-5 bg-[#141A26]">
    <Link href="/articles/new/start">
      <span className="flex items-center gap-2">
        <PlusCircle className="w-4 h-4" />
        New article
      </span>
    </Link>
  </Button>
);

const CreateArticleButtonWithPermission = withPermissions(CreateArticleButton);
