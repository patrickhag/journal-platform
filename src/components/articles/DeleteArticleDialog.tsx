'use client';

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
} from '@/components/ui/alert-dialog';
import Loader from '../Loader';
import { Button } from '@/components/ui/button';

export function DeleteaArticleDialog({
  open,
  onOpenChange,
  setAllowArticleDeletion,
  isDeletingArticlePending,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  setAllowArticleDeletion: (allow: boolean) => void;
  isDeletingArticlePending: boolean;
}) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete this
            manuscript from our database.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <Button
            disabled={isDeletingArticlePending}
            variant={'destructive'}
            onClick={() => setAllowArticleDeletion(true)}
          >
            {isDeletingArticlePending ? (
              <Loader text="Deleting..." />
            ) : (
              'Yes, Delete'
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
