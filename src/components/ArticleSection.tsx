'use client';

import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Eye, Trash, Upload } from 'lucide-react';
import { TArticle } from '@/schemas/reviewer';
import { StatusBadge } from './status-badge';
import { useEffect, useState } from 'react';
import { DeleteaArticleDialog } from './articles/DeleteArticleDialog';
import { useDeleteArticle } from '@/hooks/useArticles';
import { useRouter } from 'next/navigation';
import UploadRevisionModal from '@/app/(protected)/submissions/components/UploadRevisionModal';

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
  index,
}: {
  article: {
    id: string;
    section: string;
    userId: string;
    proofStatus?: string;
    createdAt: string;
    updatedAt: string;
    articleStatus: string;
    metadata: {
      title: string;
    };
    editorActions: Array<{
      editorfileId: string | null;
      decision: string;
      message: string;
    }>;
  };
  index: number;
}) {
  const [openDeleteArticleDialog, setOpenDeleteArticleDialog] = useState(false);
  const [allowArticleDeletion, setAllowArticleDeletion] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const onClose = () => setIsOpen(false);

  const { mutate: deleteArticle, isPending: isDeletingArticle } =
    useDeleteArticle(setOpenDeleteArticleDialog);

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

  useEffect(() => {
    if (allowArticleDeletion) {
      deleteArticle(article.id);
      setAllowArticleDeletion(false);
    }
  }, [allowArticleDeletion]);

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
                <Button
                  variant="outline"
                  onClick={() =>
                    router.push(`/articles/${transformedArticle.id}`)
                  }
                >
                  <Eye className="mr-1 h-4 w-4" />
                  View Details
                </Button>
                {transformedArticle.articleStatus === 'SUBMITTED' && (
                  <Button
                    variant="outline"
                    onClick={() => setOpenDeleteArticleDialog(true)}
                  >
                    <Trash className="mr-1 h-4 w-4" />
                    Delete Manuscript
                  </Button>
                )}

                {transformedArticle.editorDecision && (
                  <Button
                    className="bg-amber-600 hover:bg-amber-700 text-white"
                    onClick={() => setIsOpen(true)}
                  >
                    <Upload className="mr-1 h-4 w-4" />
                    Upload Revision
                  </Button>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      <DeleteaArticleDialog
        open={openDeleteArticleDialog}
        onOpenChange={setOpenDeleteArticleDialog}
        setAllowArticleDeletion={setAllowArticleDeletion}
        isDeletingArticlePending={isDeletingArticle}
      />
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
