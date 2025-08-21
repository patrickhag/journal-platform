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
  AlertDialogAction,
} from '@/components/ui/alert-dialog';

export const UserStatusDialog = ({
  open,
  onOpenChange,
  username,
  currentStatus,
  onConfirm,
  isPending,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  username: string;
  onConfirm: () => void;
  isPending: boolean;
  currentStatus: boolean | undefined;
}) => {
  const action = currentStatus ? 'deactivate' : 'activate';

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {currentStatus ? 'Deactivate' : 'Activate'} User
          </AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to {action} {username}?
            {currentStatus
              ? ' This will prevent them from accessing the system.'
              : ' This will restore their access to the system.'}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={isPending}
            className={
              currentStatus
                ? 'bg-red-600 hover:bg-red-700'
                : 'bg-green-600 hover:bg-green-700'
            }
          >
            {isPending ? (
              <Loader
                text={`${currentStatus ? 'Deactivating' : 'Activating'}...`}
              />
            ) : currentStatus ? (
              'Deactivate'
            ) : (
              'Activate'
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
