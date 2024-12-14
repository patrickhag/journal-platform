'use client'
import { useActionState } from 'react';
import { Button } from '../ui/button'
import Spinner from '../Spinner';
import { deteteresource } from '@/actions/deteteresource';

export const DeleteFile = ({ publicId }: { publicId: string }) => {
  const [, formAction, isPending] = useActionState(
    deteteresource,
    undefined
  );
  return (
    <form action={formAction}>
      <input type="hidden" name='publicId' readOnly value={publicId} />
      <Button variant="link" className="text-red-500 hover:text-red-600">
        Delete
        {isPending && <Spinner />}
      </Button>
    </form>
  )
}
