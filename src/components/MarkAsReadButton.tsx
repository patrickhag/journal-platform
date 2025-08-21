'use client';

import { useFormStatus } from 'react-dom';
import { Button } from '@/components/ui/button';
import Loader from './Loader';

export function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button className="w-full" disabled={pending}>
      {pending ? <Loader text="Marking..." /> : 'Mark all as read'}
    </Button>
  );
}
