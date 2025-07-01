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
import { useDeleteCollection } from '@/hooks/useCollections';
import { useEffect, useState } from 'react';

export function DeleteCollectionDialog({
  open,
  onOpenChange,
  collectionId,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  collectionId: string;
}) {
  const [allowDeletion, setAllowDeletion] = useState(false);

  const { mutate, isPending } = useDeleteCollection();

  useEffect(() => {
    if (allowDeletion) {
      mutate(collectionId);
    }
  }, [allowDeletion, collectionId, mutate]);

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete this
            collection.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <Button
            disabled={isPending}
            variant={'destructive'}
            onClick={() => setAllowDeletion(true)}
          >
            {isPending ? <Loader text="Deleting..." /> : 'Yes, Delete'}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
