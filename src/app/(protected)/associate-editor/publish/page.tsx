'use client';

import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileText, Plus } from 'lucide-react';
import { useGetAcceptedArticles } from '@/hooks/useArticles';
import { TPublishedArticle } from '@/types';
import PublishManuscriptSheet from './components/PublishManuscript';
import Link from 'next/link';

const PublishedArticles = () => {
  const [sheetOpen, setSheetOpen] = useState<{
    open: boolean;
    articleId?: string;
    articleTitle?: string;
  }>({
    open: false,
    articleId: '',
    articleTitle: '',
  });
  const { data: acceptedManuscripts } = useGetAcceptedArticles();

  // const [selectedPublishedArticle, setselectedPublishedArticle] =
  useState<TPublishedArticle | null>(null);
  // const [editSheetOpen, setEditSheetOpen] = useState(false);

  const handlePublishManuscript = (articleId: string, articleTitle: string) => {
    setSheetOpen({ open: true, articleId, articleTitle });
  };

  const onClose = () => setSheetOpen({ open: false });

  return (
    <>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Approve Articles Management</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Accepted Manuscripts Ready for Publication
            </CardTitle>
            <CardDescription>
              These manuscripts have been accepted and are ready to be published
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {acceptedManuscripts?.map((manuscript) => {
                const authorNames = `${manuscript.metadata.prefix}. ${manuscript.user.firstName} ${manuscript.user.lastName}`;
                return (
                  <div
                    key={manuscript.id}
                    className="border rounded-lg p-4 space-y-3"
                  >
                    <div className="flex justify-between items-start">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Link href={`/articles/${manuscript.id}`}>
                            <h3 className="font-semibold cursor-pointer hover:underline">
                              {manuscript.metadata.title}
                            </h3>
                          </Link>
                          <Badge variant="secondary">
                            {manuscript.articleStatus}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          <strong>Author:</strong> {authorNames}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          <strong>Accepted:</strong> {manuscript.acceptedAt}
                        </p>
                        <div
                          className="prose max-w-none line-clamp-2 text-sm"
                          dangerouslySetInnerHTML={{
                            __html: manuscript.metadata.abstract,
                          }}
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          handlePublishManuscript(
                            manuscript.id,
                            manuscript.metadata.title
                          )
                        }
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Approve Manuscript
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
            {acceptedManuscripts?.length === 0 && (
              <p>No accepted manuscripts found.</p>
            )}
          </CardContent>
        </Card>
      </div>
      {sheetOpen.open && (
        <PublishManuscriptSheet
          articleId={sheetOpen.articleId as string}
          open={sheetOpen.open}
          onOpenChange={onClose}
          title={sheetOpen.articleTitle as string}
        />
      )}
    </>
  );
};

export default PublishedArticles;
