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
import { useDeleteAd } from '@/hooks/useAds';

export function DeleteAdDialog({
  open,
  onOpenChange,
  adId,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  adId: string;
}) {
  const { mutate, isPending } = useDeleteAd();

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This will remove this article from editor's pick.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <Button
            disabled={isPending}
            variant={'destructive'}
            onClick={() => {
              mutate(adId, {
                onSettled: () => {
                  onOpenChange(false);
                },
              });
            }}
          >
            {isPending ? <Loader text="Removing..." /> : 'Yes, Remove'}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
