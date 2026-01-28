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

type ForwardToAuthorDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isForwarding: boolean;
};

export default function ForwardToAuthorDialog({
  open,
  onOpenChange,
  onConfirm,
  isForwarding,
}: ForwardToAuthorDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Forward to Author?</AlertDialogTitle>
          <AlertDialogDescription>
            This action will set the manuscript status to{' '}
            <span className="font-semibold">CORRECTION</span>, which allows the
            author to reply to corrections.
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
