import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { useReviewerFunctions } from '@/hooks/useReviews';
import { UserMinus } from 'lucide-react';
import Loader from '@/components/Loader';

export function UnAssignAlertDialog({
  isOpen,
  setOpenAlertDialog,
  userId,
  articleId,
}: {
  isOpen: boolean;
  setOpenAlertDialog: (open: boolean) => void;
  userId: string;
  articleId: string;
}) {
  const { mutate, isPending } = useReviewerFunctions();

  const handleUnassignReviewer = () => {
    const payloadData = {
      articleId,
      userId,
    };
    mutate(payloadData, {
      onSettled: () => {
        setOpenAlertDialog(false);
      },
    });
  };

  return (
    <AlertDialog onOpenChange={setOpenAlertDialog} open={isOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="outline">Unassign Reviewer</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Unassign Reviewer</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to unassign this reviewer? This action can be
            reversed by assigning a new reviewer.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setOpenAlertDialog(false)}>
            Cancel
          </AlertDialogCancel>
          <Button
            onClick={handleUnassignReviewer}
            disabled={isPending}
            className="bg-red-500 hover:bg-red-600 focus:ring-red-500 text-white rounded-md px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
          >
            <UserMinus className="h-4 w-4 mr-1" />
            {isPending ? <Loader text="Unassigning..." /> : 'Unassign'}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
