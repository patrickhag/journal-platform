import { CommentPreview } from './CommentPreview';
import { Card, CardContent } from './ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Button } from './ui/button';
import { MoreHorizontal } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { TArticle } from '@/schemas/reviewer';
import { StatusBadge } from './status-badge';
import { articleSubmissions, db } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export function ArticleSection({
  article: a,
  index: i,
}: {
  article: TArticle;
  index: number;
}) {
  return (
    <Card key={a.id}>
      <CardContent className="flex items-center justify-between p-6">
        <div className="flex gap-6">
          <div className="flex items-center">
            <span className="text-xl font-medium text-muted-foreground">
              {(i + 1).toString().padStart(4, '0')}
            </span>
          </div>
          <div className="space-y-1">
            <h3 className="font-medium uppercase">{a.section}</h3>
            <CommentPreview html={a.commentsForEditor} />
            <small className={cn('mt-2')}>
              <StatusBadge status={a.articleStatus || 'Submitted'} />
            </small>
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
            <DropdownMenuItem>
              <Link href={`articles/${a.id}`}>View details</Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <form
                action={async () => {
                  'use server';
                  await db
                    .update(articleSubmissions)
                    .set({
                      articleStatus: 'Archived',
                    })
                    .where(eq(articleSubmissions.id, a.id));

                  revalidatePath('/submissions');
                }}
              >
                <button>Move to archive</button>
              </form>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link href={a.fileURI || '#'}>Download PDF</Link>
            </DropdownMenuItem>
            <DropdownMenuItem>Share</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardContent>
    </Card>
  );
}
