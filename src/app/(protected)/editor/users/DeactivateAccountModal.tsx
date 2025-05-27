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

export function DeactivateUserDialog({
  open,
  onOpenChange,
  setAllowDeactivating,
  isDisablingPending,
  username,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  setAllowDeactivating: (allow: boolean) => void;
  isDisablingPending?: boolean;
  username: string;
}) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action can be reversed. This will deactivate {username}&apos;s
            account.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <Button
            disabled={isDisablingPending}
            variant={'destructive'}
            onClick={() => setAllowDeactivating(true)}
          >
            {isDisablingPending ? (
              <Loader text="Deactivating..." />
            ) : (
              'Yes, De-activate'
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
