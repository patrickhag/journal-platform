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
import { Bell } from 'lucide-react';
import { useReviewerFunctions } from '@/hooks/useReviews';
import Loader from '@/components/Loader';

export function RemindReviewersDialog({
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

  const handleRemindReviewers = () => {
    const payloadData = {
      articleId,
      userId,
      isItNotification: true,
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
        <Button variant="outline">Remind Reviewer</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Remind Reviewer</AlertDialogTitle>
          <AlertDialogDescription>
            You are about to remind the reviewer of this manuscript to review
            it.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <Button
            onClick={handleRemindReviewers}
            disabled={isPending}
            className="bg-blue-500 hover:bg-blue-600 focus:ring-blue-500 text-white rounded-md px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
          >
            <Bell className="h-4 w-4 mr-1" />
            {isPending ? <Loader text="Reminding..." /> : 'Remind'}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
