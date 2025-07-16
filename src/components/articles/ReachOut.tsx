'use client';

import { FC, useState } from 'react';
import { Button } from '../ui/button';
import { format } from 'date-fns';
import { CalendarIcon, Send } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useParams } from 'next/navigation';
import { useInviteReviewer } from '@/hooks/useUsers';
import Loader from '../Loader';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { useSession } from 'next-auth/react';

export const ReachOut: FC<{
  toEmail: string;
  reviewerNames: string;
  open: boolean;
  setOpen: (open: boolean) => void;
}> = ({ reviewerNames, toEmail, open, setOpen }) => {
  const [date, setDate] = useState<Date>();
  const [warning, setWarning] = useState<string>('');

  const { articleId } = useParams();

  const { mutate, isPending } = useInviteReviewer();

  const handleSubmit = () => {
    if (!date) {
      setWarning('Please select a due date before inviting');
      return;
    }

    const data = {
      reviewerNames,
      toEmail,
      date,
      articleId,
    };
    mutate(data, {
      onSettled: () => {
        setOpen(false);
      },
    });
    setWarning('');
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invite Reviewer</DialogTitle>
            <DialogDescription>
              Send reviewer email invitation and set review deadline.
            </DialogDescription>
          </DialogHeader>

          {warning && <p className="text-sm text-red-500">{warning}</p>}

          <div className="flex w-full flex-col">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    'w-full justify-start text-left font-normal',
                    !date && 'text-muted-foreground'
                  )}
                >
                  <CalendarIcon className="mr-2" />
                  {date ? format(date, 'PPP') : <span>Add due date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  disabled={(date) => date < new Date()}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          <Button className="mt-2" disabled={isPending} onClick={handleSubmit}>
            {isPending ? <Loader text="Inviting..." /> : 'Invite'}
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
};
