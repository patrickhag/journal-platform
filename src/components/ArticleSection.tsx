'use client';

import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Eye } from 'lucide-react';
import { TArticle } from '@/schemas/reviewer';
import { StatusBadge } from './status-badge';
import { useState } from 'react';
import UploadRevisionModal from '@/app/(protected)/author/submissions/components/UploadRevisionModal';
import Link from 'next/link';

export function ArticleSection({ articles }: { articles: TArticle[] }) {
  return (
    <>
      {articles.map((article, index) => (
        <ArticleCard key={index} article={article} />
      ))}
    </>
  );
}

function ArticleCard({ article }: { article: TArticle }) {
  const [isOpen, setIsOpen] = useState(false);

  const onClose = () => setIsOpen(false);

  // Transform article data for display
  const latestEditorAction =
    article.editorActions?.[article.editorActions.length - 1];
  const transformedArticle = {
    id: article.id,
    title: article.metadata?.title || 'Untitled',
    submittedAt: article.createdAt,
    lastUpdated: article.updatedAt,
    articleStatus: article.articleStatus,
    editorDecision: latestEditorAction?.decision || null,
    editorMessage: latestEditorAction?.message || null,
    editorFile: latestEditorAction?.editorfileId || null,
  };

  return (
    <>
      <Card className="shadow-none">
        <CardContent className="p-0">
          <div className="border rounded-lg p-3 md:p-4 hover:bg-gray-50 transition-colors">
            <div className="flex flex-col sm:flex-row items-start justify-between gap-3 sm:gap-4">
              {/* Left Section: Title, Dates, Status */}
              <div className="flex-1 min-w-0 w-full">
                <Link href={`/articles/${transformedArticle.id}`}>
                  <h3 className="font-semibold text-base md:text-lg text-gray-900 mb-2 line-clamp-2 sm:line-clamp-1">
                    {transformedArticle.title}
                  </h3>
                </Link>

                <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-1 sm:space-y-0 text-xs sm:text-sm text-gray-600 mb-3">
                  <span>
                    Submitted:{' '}
                    {new Date(
                      transformedArticle.submittedAt
                    ).toLocaleDateString()}
                  </span>
                  <span className="hidden sm:inline">•</span>
                  <span>
                    Last Updated:{' '}
                    {new Date(
                      transformedArticle.lastUpdated
                    ).toLocaleDateString()}
                  </span>
                </div>

                <StatusBadge
                  status={transformedArticle.articleStatus || 'Submitted'}
                />
              </div>

              {/* Right Section: Action Buttons */}
              <div className="flex space-x-2 w-full sm:w-auto sm:ml-4">
                <Link
                  href={`/articles/${transformedArticle.id}`}
                  className="flex-1 sm:flex-initial"
                >
                  <Button
                    variant="outline"
                    size="sm"
                    className="cursor-pointer w-full sm:w-auto"
                  >
                    <Eye className="mr-1 h-4 w-4" />
                    View Details
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <UploadRevisionModal
        articleId={transformedArticle.id}
        articleTitle={transformedArticle.title}
        isOpen={isOpen}
        onClose={onClose}
        editorActions={article.editorActions || []}
      />
    </>
  );
}
