'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Eye, Search, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AuthorReplyModal from './components/AuthorReplyModal';
import { useGetAuthorsReviews } from '@/hooks/useReviews';
import { TArticlesReview } from '@/types';
import Link from 'next/link';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { ReviewCard } from '@/components/ReviewCard';
import { StatusBadge } from '@/components/status-badge';
import { ArticleSkeleton } from '@/components/articles/ArticleSkeleton';
import { Input } from '@/components/ui/input';

const ReviewsReceived = () => {
  const { data: manuscripts, isPending } = useGetAuthorsReviews();
  const [searchQuery, setSearchQuery] = useState('');

  const [selectedManuscript, setSelectedManuscript] =
    useState<TArticlesReview | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const handleViewReviews = (manuscript: TArticlesReview) => {
    setSelectedManuscript(manuscript);
    setIsSheetOpen(true);
  };

  const filteredManuscripts = manuscripts?.filter((manuscript) => {
    return manuscript.metadata.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Reviews Received</h1>
      </div>

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
          <Link href="/author/new-manuscript">
            <PlusCircle className="w-4 h-4 mr-2" />
            Submit New Article
          </Link>
        </Button>
      </div>

      {isPending ? (
        <>
          {Array.from({ length: 3 }).map((_, i) => (
            <div className="mb-3" key={i}>
              <ArticleSkeleton />
            </div>
          ))}
        </>
      ) : (
        <div className="w-full">
          {filteredManuscripts?.map((manuscript) => (
            <Card key={manuscript.id} className="flex flex-col">
              <CardHeader className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <Link
                    href={`/articles/${manuscript.id}`}
                    target="_blank"
                    className="font-semibold text-lg hover:underline"
                  >
                    {manuscript.metadata.title}
                  </Link>
                  <StatusBadge status={manuscript.articleStatus || ''} />
                </div>
              </CardHeader>
              <CardContent className="mt-auto flex justify-between">
                <div className="text-sm text-muted-foreground space-y-1">
                  <p>{manuscript.reviews.length} review(s)</p>
                </div>
                <Button
                  size="sm"
                  onClick={() => handleViewReviews(manuscript)}
                  className="flex items-center gap-2"
                >
                  <Eye className="h-4 w-4" />
                  View Reviews
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      {!isPending && filteredManuscripts?.length === 0 && (
        <div className="text-center py-12">
          <div className="bg-card border border-border rounded-xl p-8 max-w-md mx-auto">
            <p className="text-muted-foreground text-lg">
              No reviews found here.
            </p>
          </div>
        </div>
      )}

      {/* Sheet for Reviews */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent
          side="right"
          className="w-full sm:max-w-2xl flex flex-col h-full"
        >
          {/* Scrollable content area */}
          <div className="flex-1 overflow-y-auto">
            <SheetHeader>
              <SheetTitle>
                {selectedManuscript
                  ? `Reviews for: ${selectedManuscript.metadata.title}`
                  : 'Reviews'}
              </SheetTitle>
              <SheetDescription>
                Review details and reviewer feedback
              </SheetDescription>
            </SheetHeader>

            {selectedManuscript && (
              <div className="space-y-4 mt-6">
                {selectedManuscript.reviews.map((review, index) => (
                  <ReviewCard
                    key={review.id}
                    review={review}
                    showDownloadButton={true}
                    showViewButton={true}
                    reviewerDisplayName={`Reviewer ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </div>

          <SheetFooter className="sticky bottom-0 bg-white mt-4 py-4 flex justify-end gap-2">
            <AuthorReplyModal articleId={selectedManuscript?.id || ''} />
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default ReviewsReceived;
