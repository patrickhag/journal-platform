'use client';

import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Eye, Upload } from 'lucide-react';
import { TArticle } from '@/schemas/reviewer';
import { StatusBadge } from './status-badge';
import { useState } from 'react';
import UploadRevisionModal from '@/app/(protected)/submissions/components/UploadRevisionModal';
import Link from 'next/link';

export function ArticleSection({ articles }: { articles: TArticle[] }) {
  return (
    <>
      {articles.map((article, index) => (
        <ArticleCard key={article.id} article={article} index={index} />
      ))}
    </>
  );
}

function ArticleCard({
  article,
}: {
  article: {
    id: string;
    section: string;
    userId: string;
    proofStatus: string;
    createdAt: string;
    updatedAt: string;
    articleStatus: string;
    metadata: {
      title: string;
    };
    editorActions: Array<{
      editorfileId: string;
      decision: string;
      message: string;
    }>;
  };
  index: number;
}) {
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
          <div className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-start justify-between">
              {/* Left Section: Title, Dates, Status */}
              <div className="flex-1">
                <h3 className="font-semibold text-lg text-gray-900 mb-2">
                  {transformedArticle.title}
                </h3>

                <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                  <span>
                    Submitted:{' '}
                    {new Date(
                      transformedArticle.submittedAt
                    ).toLocaleDateString()}
                  </span>
                  <span>•</span>
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
              <div className="flex space-x-2 ml-4">
                <Link href={`/articles/${transformedArticle.id}`}>
                  <Button variant="outline" size="sm">
                    <Eye className="mr-1 h-4 w-4" />
                    View Details
                  </Button>
                </Link>
                {/* {transformedArticle.editorDecision && (
                  <Button
                    className="bg-amber-600 hover:bg-amber-700 text-white"
                    size="sm"
                    onClick={() => setIsOpen(true)}
                  >
                    <Upload className="mr-1 h-4 w-4" />
                    Upload Revision
                  </Button>
                )} */}
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
        editorActions={article.editorActions}
      />
    </>
  );
}
