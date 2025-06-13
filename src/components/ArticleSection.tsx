'use client';

import { Card, CardContent } from './ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Button } from './ui/button';
import {
  MoreHorizontal,
  FileText,
  Eye,
  Archive,
  Trash,
  FileCheck,
  SquareArrowOutUpRight,
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { TArticle } from '@/schemas/reviewer';
import { StatusBadge } from './status-badge';
import { useEffect, useState } from 'react';
import { DeleteaArticleDialog } from './articles/DeleteArticleDialog';
import { useDeleteArticle } from '@/hooks/useArticles';
import { useRouter } from 'next/navigation';

export function ArticleSection({
  article: a,
  index: i,
}: {
  article: TArticle;
  index: number;
}) {
  const [openDeleteArticleDialog, setOpenDeleteArticleDialog] = useState(false);
  const [allowArticleDeletion, setAllowArticleDeletion] = useState(false);

  const router = useRouter();

  const { mutate: deleteArticle, isPending: isDeletingArticle } =
    useDeleteArticle(setOpenDeleteArticleDialog);

  useEffect(() => {
    if (allowArticleDeletion) {
      deleteArticle(a.id);
      setAllowArticleDeletion(false);
    }
  }, [allowArticleDeletion]);

  return (
    <>
      <Card key={a.id}>
        <CardContent className="flex items-center justify-between p-6">
          <div className="flex gap-6">
            <div className="flex items-center">
              <span className="text-xl font-medium text-muted-foreground">
                {(i + 1).toString().padStart(4, '0')}
              </span>
            </div>
            <div className="space-y-2">
              <h3 className="flex items-center gap-1 font-medium">
                <FileText className="h-4 w-4 text-muted-foreground" />
                {a.section}
              </h3>
              <div className="text-mdm">{a.title}</div>
              <div className={`flex ${cn('mt-2')}`}>
                <StatusBadge status={a.articleStatus || 'Submitted'} />
                {a.proofStatus === 'Finalized' && (
                  <Link href={'/submissions/proof'}>
                    <button className="inline-flex items-center px-3 py-1 rounded-md text-sm font-medium bg-indigo-50 text-indigo-900 hover:bg-indigo-100 transition-colors duration-150 ml-3">
                      <SquareArrowOutUpRight size={16} className="mr-1" />
                      View Proofs
                    </button>
                  </Link>
                )}
              </div>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => router.push(`articles/${a.id}`)}>
                <Eye className="h-4 w-4" />
                View details
              </DropdownMenuItem>
              <DropdownMenuItem
                className="flex items-center gap-2 text-red-500"
                onClick={() => setOpenDeleteArticleDialog(true)}
              >
                <Trash className="h-4 w-4" />
                Delete article
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardContent>
      </Card>
      <DeleteaArticleDialog
        open={openDeleteArticleDialog}
        onOpenChange={setOpenDeleteArticleDialog}
        setAllowArticleDeletion={setAllowArticleDeletion}
        isDeletingArticlePending={isDeletingArticle}
      />
    </>
  );
}
