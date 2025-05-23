'use client';

import { TabsContent } from '@/components/ui/tabs';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dot, FilePlus, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useEditorsPick, useGetEditorsPick } from '@/hooks/useSettings';
import Loader from '@/components/Loader';
import { useState } from 'react';
import EditorsCardSkeleton from './SkeletonEditorsPick';

export default function EditorsPick() {
  const { data: editorsPicks, isPending: isLoadingPicks } = useGetEditorsPick();
  const [loadingArticleId, setLoadingArticleId] = useState<string | null>(null);
  const { mutate, isPending } = useEditorsPick();

  const handleRemoveEditorsPick = (articleId: string) => {
    setLoadingArticleId(articleId);
    mutate(
      { articleId },
      {
        onSettled: () => {
          setLoadingArticleId(null);
        },
      }
    );
  };

  return (
    <TabsContent value="editor-picks" className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Featured Articles</CardTitle>
          <CardDescription>
            Select articles to feature on the journal&apos;s homepage
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoadingPicks && <Loader text="Loading..." />}

          {/* No articles found */}
          {!isLoadingPicks && editorsPicks?.length === 0 && (
            <p className="text-sm text-muted-foreground mb-4">
              No featured articles yet. Add one to get started.
            </p>
          )}

          {/* Loaded articles */}
          {!isLoadingPicks &&
            editorsPicks?.map((article) => (
              <div
                key={article.id}
                className="flex items-start mb-6 pb-6 border-b last:border-0"
              >
                <div className="flex-1 space-y-1">
                  <h3 className="font-medium">{article.metadata.title}</h3>
                  <div className="flex items-center">
                    <p className="text-sm font-medium">{article.section}</p>
                    <Dot />
                    <p className="text-sm text-gray-500">
                      {article.user.firstName + ' ' + article.user.lastName}
                    </p>
                  </div>
                </div>
                <div>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleRemoveEditorsPick(article.id)}
                    disabled={isPending}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    {loadingArticleId === article.id ? (
                      <Loader text="Loading..." />
                    ) : (
                      'Remove Article'
                    )}
                  </Button>
                </div>
              </div>
            ))}
        </CardContent>
      </Card>
    </TabsContent>
  );
}
