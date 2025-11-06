'use client';

import Loader from '@/components/Loader';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { usePublishAcceptedArticle } from '@/hooks/useReviews';

export function ApproveManuscriptDialog({
  open,
  onOpenChange,
  articleId,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  articleId: string;
}) {
  const { mutate, isPending } = usePublishAcceptedArticle(
    articleId as string,
    onOpenChange
  );

  const handleAcceptManuscript = () => {
    mutate();
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Manuscript Publish Confirmation</AlertDialogTitle>
          <AlertDialogDescription>
            By proceeding, you will approve this manuscript for publication.
            Upon approval, the manuscript&apos;s status will be updated and it
            will be officially published.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <Button
            disabled={isPending}
            variant={'secondary'}
            onClick={() => handleAcceptManuscript()}
          >
            {isPending ? <Loader text="Publishing..." /> : 'Yes, Publish'}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
