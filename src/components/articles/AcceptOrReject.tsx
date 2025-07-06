'use client';

import { Button } from '@/components/ui/button';
import withPermissions from '../WithPermission';
import { useRejectManuscript } from '@/hooks/useRejectManuscript';
import Loader from '../Loader';
import { useState } from 'react';
import AssignEditorModal from '@/app/(protected)/articles/[articleId]/components/AssignAssociateEditorModal';

const AcceptOrReject = ({ articleId }: { articleId: string }) => {
  const { mutate: rejectManuscript, isPending } = useRejectManuscript();

  const [open, setOpen] = useState(false);

  const onClose = () => setOpen(false);

  return (
    <>
      <div className="w-4/5 mx-auto grid grid-cols-2 gap-2 mt-5">
        <Button
          className="bg-green-500 hover:bg-green-600"
          onClick={() => setOpen(true)}
        >
          Assign Editor
        </Button>
        <Button
          className="bg-red-500 hover:bg-red-600"
          onClick={() => {
            rejectManuscript({ articleId });
          }}
          disabled={isPending}
        >
          {isPending ? <Loader text="Rejecting..." /> : 'Reject Manuscript'}
        </Button>
      </div>
      <AssignEditorModal
        isOpen={open}
        onClose={onClose}
        articleId={articleId}
      />
    </>
  );
};

export const AcceptOrRejectComponent = withPermissions(AcceptOrReject);
