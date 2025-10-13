'use client';

import { Button } from '@/components/ui/button';
import withPermissions from '../WithPermission';
import { useState } from 'react';
import AssignStaffEditorModal from './AssignStaffEditorModal';
import { RejectManuscriptModal } from './RejectManuscriptModal';

const AssignOrReject = ({ articleId }: { articleId: string }) => {
  const [open, setOpen] = useState(false);
  const [openRejectModal, setOpenRejectModal] = useState(false);

  const onClose = () => setOpen(false);

  return (
    <>
      <div className="w-4/5 mx-auto grid grid-cols-2 gap-2 mt-5">
        <Button
          className="bg-green-500 hover:bg-green-600"
          onClick={() => setOpen(true)}
        >
          Assign Staff Editor
        </Button>
        <Button
          className="bg-red-500 hover:bg-red-600"
          onClick={() => setOpenRejectModal(true)}
        >
          Reject Manuscript
        </Button>
      </div>
      {open && (
        <AssignStaffEditorModal
          isOpen={open}
          onClose={onClose}
          articleId={articleId}
        />
      )}
      {openRejectModal && (
        <RejectManuscriptModal
          onOpenChange={setOpenRejectModal}
          open={openRejectModal}
        />
      )}
    </>
  );
};

export const AssignOrRejectComponent = withPermissions(AssignOrReject);
