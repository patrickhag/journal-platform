'use client';

import { Button } from '@/components/ui/button';
import withPermissions from '../WithPermission';
import {
  useAcceptManuscript,
  useRejectManuscript,
} from '@/hooks/useRejectManuscript';
import Loader from '../Loader';

const AcceptOrReject = ({ articleId }: { articleId: string }) => {
  const { mutate: rejectManuscript, isPending } = useRejectManuscript();
  const { mutate: acceptManuscript, isPending: isAcceptingPending } =
    useAcceptManuscript();

  return (
    <div className="w-4/5 mx-auto grid grid-cols-2 gap-2 mt-5">
      <Button
        className="bg-green-500 hover:bg-green-600"
        onClick={() => {
          acceptManuscript({ articleId });
        }}
        disabled={isAcceptingPending}
      >
        {isAcceptingPending ? <Loader /> : ''}Accept this manuscript
      </Button>
      <Button
        className="bg-red-500 hover:bg-red-600"
        onClick={() => {
          rejectManuscript({ articleId });
        }}
        disabled={isPending}
      >
        {isPending ? <Loader /> : ''} Reject this manuscript
      </Button>
    </div>
  );
};

export const AcceptOrRejectComponent = withPermissions(AcceptOrReject);
