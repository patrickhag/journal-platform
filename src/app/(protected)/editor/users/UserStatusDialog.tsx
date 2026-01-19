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
import { useDeactivateUser } from '@/hooks/useUsers';

export const UserStatusDialog = ({
  open,
  userId,
  onOpenChange,
  username,
  currentStatus,
}: {
  open: boolean;
  userId: string;
  onOpenChange: (open: boolean) => void;
  username: string;
  currentStatus: boolean | undefined;
}) => {
  const action = currentStatus ? 'deactivate' : 'activate';

  const { mutate, isPending: isDeactivateUserPending } =
    useDeactivateUser(userId);

  const handleConfirmedStatusChange = () => {
    const newStatus = !currentStatus;
    const payload = {
      isActive: newStatus,
    };
    mutate(payload, {
      onSuccess: () => {
        onOpenChange(!open);
      },
    });
  };

  return (
    <AlertDialog open={open}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {currentStatus ? 'Deactivate' : 'Activate'} User
          </AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to {action} {username}?
            {currentStatus
              ? ' This will prevent them from accessing the platform.'
              : ' This will restore their access to the platform.'}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeactivateUserPending}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirmedStatusChange}
            disabled={isDeactivateUserPending}
            className={
              currentStatus
                ? 'bg-red-600 hover:bg-red-700'
                : 'bg-green-600 hover:bg-green-700'
            }
          >
            {isDeactivateUserPending ? (
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
