'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useRequestRecorrection } from '@/hooks/useReviews';
import Loader from '@/components/Loader';

interface Props {
  correctionId: string;
}

export const AssociateEditorCorrectionStatusModal: React.FC<Props> = ({
  correctionId,
}) => {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState('');
  const [note, setNote] = useState('');

  const { mutate, isPending } = useRequestRecorrection(correctionId);

  const handleSubmit = () => {
    const data = {
      status,
      note,
    };

    mutate(data, {
      onSettled: () => {
        setOpen(false);
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          Approve/Revision
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Update Associate Editor Correction Status</DialogTitle>
          <DialogDescription>
            Use this panel to change the current correction status manually.
          </DialogDescription>
        </DialogHeader>

        <div>
          <Label>
            Status <span className="text-red-500">*</span>
          </Label>
          <RadioGroup
            className="flex flex-row items-center space-x-6 mt-2"
            value={status}
            onValueChange={(value) => setStatus(value)}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="APPROVED" id="APPROVED" />
              <Label htmlFor="APPROVED">Approve</Label>
            </div>

            <div className="flex items-center space-x-2">
              <RadioGroupItem value="REVISION" id="REVISION" />
              <Label htmlFor="REVISION">Revision</Label>
            </div>
          </RadioGroup>

          <div className="flex flex-col space-y-2 mt-5">
            <Label>Message (optional)</Label>
            <Textarea
              placeholder="Add a note or message to the Associate Editor (optional)"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isPending || !status}>
            {isPending ? <Loader text="Informing..." /> : 'Inform'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
