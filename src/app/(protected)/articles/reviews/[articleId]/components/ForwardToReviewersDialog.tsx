'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

type ForwardToReviewersDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isForwarding: boolean;
};

export default function ForwardToReviewersDialog({
  open,
  onOpenChange,
  onConfirm,
  isForwarding,
}: ForwardToReviewersDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Forward to Reviewers?</AlertDialogTitle>
          <AlertDialogDescription>
            This will notify reviewers who requested corrections and move the
            manuscript back to <span className="font-semibold">UNDER REVIEW</span>.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isForwarding}>Cancel</AlertDialogCancel>
          <AlertDialogAction disabled={isForwarding} onClick={onConfirm}>
            {isForwarding ? 'Forwarding...' : 'Yes, Forward'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
