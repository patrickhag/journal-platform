'use client'
import { useActionState } from 'react';
import { Button } from '../ui/button'
import { deteteresource } from '@/lib/actions';
import Spinner from '../Spinner';

export const DeleteFile = ({ publicId }: { publicId: string }) => {
    const [prevState, formAction, isPending] = useActionState(
        deteteresource,
        undefined
      );
    return (
        <form action={formAction}>
            <input type="hidden" name='publicId' readOnly value={publicId} />
            <Button variant="link" className="text-red-500 hover:text-red-600">
                Delete
                {isPending && <Spinner  />}
            </Button>
        </form>
    )
}
