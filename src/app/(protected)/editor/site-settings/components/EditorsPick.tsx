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
import { Dot, Trash2 } from 'lucide-react';
import { useGetEditorsPick } from '@/hooks/useSettings';
import { useState } from 'react';
import EditorsCardSkeleton from './SkeletonEditorsPick';
import { RemoveEditorsPickDialog } from './ConfirmRemoveEditorsPickDialog';
import Link from 'next/link';

export default function EditorsPick() {
  const { data: editorsPicks = [], isPending: isLoadingPicks } =
    useGetEditorsPick();
  const [loadingArticleId, setLoadingArticleId] = useState('');
  const [openDialog, setopenDialog] = useState(false);

  return (
    <>
      <TabsContent value="editor-picks" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Featured Articles</CardTitle>
            <CardDescription>
              Select articles in{' '}
              <Link
                href={'/editor/manage-published'}
                className="text-blue-600 hover:underline"
              >
                published articles
              </Link>{' '}
              to be featured on the journal&apos;s homepage
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* No articles found */}
            {isLoadingPicks ? (
              [...Array(3)].map((_, index) => (
                <EditorsCardSkeleton key={index} />
              ))
            ) : editorsPicks.length > 0 ? (
              editorsPicks.map((pickedArticle) => (
                <div
                  key={pickedArticle.id}
                  className="flex items-start mb-6 pb-6 border-b last:border-0"
                >
                  <div className="flex-1 space-y-1">
                    <Link href={`/articles/${pickedArticle.id}`}>
                      <h3 className="font-medium">
                        {pickedArticle.article.metadata.title}
                      </h3>
                    </Link>
                    <div className="flex items-center">
                      <p className="text-sm font-medium">
                        {pickedArticle.article.section}
                      </p>
                      <Dot />
                      <p className="text-sm text-gray-500">
                        {pickedArticle.article.user.firstName +
                          ' ' +
                          pickedArticle.article.user.lastName}
                      </p>
                    </div>
                  </div>
                  <div>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => {
                        setopenDialog(true);
                        setLoadingArticleId(pickedArticle.article.id);
                      }}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Remove Article
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground mb-4">
                No featured articles yet. Add one to get started.
              </p>
            )}
          </CardContent>
        </Card>
      </TabsContent>
      {openDialog && (
        <RemoveEditorsPickDialog
          open={openDialog}
          articleId={loadingArticleId}
          onOpenChange={setopenDialog}
        />
      )}
    </>
  );
}
