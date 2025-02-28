'use client';

import { FC, useActionState, useState } from 'react';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { reachOut } from '@/actions/reachOut';
import Loader from '../Loader';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

export const ReachOut: FC<{
  reviewer: string;
  article: {
    title: string;
    content: string;
    article: string;
  };
  author: {
    name?: string | null;
    role?: string | null;
    avatar?: string | null;
  };
  toEmail: string;
}> = ({ article, author, reviewer, toEmail }) => {
  const [returnedMessage, formAction, isPending] = useActionState(
    reachOut,
    undefined
  );
  const [date, setDate] = useState<Date>();

  return (
    <form className="grid gap-3" action={formAction}>
      {returnedMessage && <p className="text-green-500">{returnedMessage}</p>}
      <div className="mb-3">
        <p>
          Set a Review Deadline and Message for{' '}
          <span className="font-bold">{reviewer}.</span>
        </p>
      </div>
      <input
        type="hidden"
        name="reviewer"
        id="reviewer"
        value={reviewer}
        readOnly
      />
      <input
        type="hidden"
        name="author"
        id="author"
        value={JSON.stringify(author)}
        readOnly
      />
      <input
        type="hidden"
        name="article"
        id="article"
        value={JSON.stringify(article)}
        readOnly
      />
      <input
        type="hidden"
        name="toEmail"
        id="toEmail"
        value={toEmail}
        readOnly
      />
      <input
        type="hidden"
        name="dueDate"
        value={date ? format(date, 'yyyy-MM-dd') : ''}
        readOnly
      />

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
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      <Textarea placeholder="Message" name="message" className="h-32" />
      <Button className="mt-2" disabled={isPending}>
        {isPending ? <Loader text="Sending..." /> : 'Send'}
      </Button>
    </form>
  );
};
