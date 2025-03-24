'use client';

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  //   AlertDialogAction,
} from '@/components/ui/alert-dialog';
import Loader from '../Loader';
import { Button } from '@/components/ui/button';

export function DeleteIssueDialog({
  open,
  onOpenChange,
  setAllowIssueDeletion,
  isDeletingIssuePending,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  setAllowIssueDeletion: (allow: boolean) => void;
  isDeletingIssuePending: boolean;
}) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete this
            issue.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <Button
            disabled={isDeletingIssuePending}
            variant={'destructive'}
            onClick={() => setAllowIssueDeletion(true)}
          >
            {isDeletingIssuePending ? (
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
