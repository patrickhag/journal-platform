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
import { useAcceptArticle } from '@/hooks/useReviews';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export function ApproveManuscriptDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { articleId } = useParams();

  const { mutate, isPending } = useAcceptArticle(
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
          <AlertDialogTitle>Manuscript Approval Confirmation</AlertDialogTitle>
          <AlertDialogDescription>
            By proceeding, you will approve this manuscript for publication.
            Upon approval, the manuscript&apos;s status will be updated and it
            will be prepared for the publication process.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <Button
            disabled={isPending}
            variant={'secondary'}
            onClick={() => handleAcceptManuscript()}
          >
            {isPending ? <Loader text="Approving..." /> : 'Yes, Approve'}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
