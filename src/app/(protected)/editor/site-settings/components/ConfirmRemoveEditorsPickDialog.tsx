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
import { useEditorsPick } from '@/hooks/useSettings';

export function RemoveEditorsPickDialog({
  open,
  onOpenChange,
  articleId,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  articleId: string;
}) {
  const { mutate, isPending } = useEditorsPick();

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
            onClick={() =>
              mutate({ articleId }, { onSettled: () => onOpenChange(false) })
            }
          >
            {isPending ? <Loader text="Removing..." /> : 'Yes, Remove'}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
