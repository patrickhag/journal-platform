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
import { useRejectManuscript } from '@/hooks/useRejectManuscript';
import { useParams } from 'next/navigation';

export function RejectManuscriptModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { articleId } = useParams();
  const { mutate: rejectManuscript, isPending } = useRejectManuscript();

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            ⚠️ Are you sure you want to reject this manuscript?
          </AlertDialogTitle>
          <AlertDialogDescription>
            The manuscript will be removed from the review workflow and the
            author will be notified of the editorial decision.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <Button
            disabled={isPending}
            variant={'destructive'}
            onClick={() =>
              rejectManuscript(articleId as string, {
                onSettled: () => onOpenChange(false),
              })
            }
          >
            {isPending ? <Loader text="Rejecting..." /> : 'Reject & Notify'}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
