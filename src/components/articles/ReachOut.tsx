'use client';

import { FC, useActionState } from 'react';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { reachOut } from '@/actions/reachOut';
import Loader from '../Loader';

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
  const [errorMessage, formAction, isPending] = useActionState(
    reachOut,
    undefined
  );

  return (
    <form className="grid gap-3" action={formAction}>
      {errorMessage && <p className="text-green-500">{errorMessage}</p>}
      <h3>Send a message to {reviewer}</h3>
      <input
        type="hidden"
        name="toEmail"
        id="toEmail"
        value={toEmail}
        readOnly
      />
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
        value={reviewer}
        readOnly
      />
      <Textarea placeholder="Message" name="message" />
      <Button className="mt-2" disabled={isPending}>
        {isPending ? <Loader text="Sending..." /> : 'Send'}
      </Button>
    </form>
  );
};
