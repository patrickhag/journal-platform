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

export function DeleteVolumeDialog({
  open,
  onOpenChange,
  setAllowVolumeDeletion,
  isDeletingVolumepending,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  setAllowVolumeDeletion: (allow: boolean) => void;
  isDeletingVolumepending?: boolean;
}) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete this
            volume.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <Button
            disabled={isDeletingVolumepending}
            variant={'destructive'}
            onClick={() => setAllowVolumeDeletion(true)}
          >
            {isDeletingVolumepending ? (
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
