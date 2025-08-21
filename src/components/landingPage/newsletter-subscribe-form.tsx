'use client';

import { useActionState } from 'react';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { subscribeNewsletter } from '@/actions/subscribeNewsletter';

export default function NewsletterSubscribeForm({
  defaultEmail,
}: {
  defaultEmail?: string;
}) {
  const [_state, formAction, pending] = useActionState(
    async (_state: any, formData: FormData) => {
      const result = await subscribeNewsletter(formData);
      toast.info(result.message);
      return result;
    },
    null
  );

  return (
    <form action={formAction} className="flex flex-col gap-2">
      <Input
        name="email"
        type="email"
        placeholder="johndoe@gmail.com"
        defaultValue={defaultEmail}
        required
      />
      <Button
        type="submit"
        disabled={pending}
        className="text-white px-3 py-2 rounded bg-[#212c9e] hover:bg-[#1A237E]"
      >
        {pending ? 'Subscribing...' : 'Subscribe'}
      </Button>
    </form>
  );
}
