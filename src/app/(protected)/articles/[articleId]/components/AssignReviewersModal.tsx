'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { User, CheckCircle, CalendarIcon, UserRoundPlus } from 'lucide-react';
import { useAssignReviewer, useGetReviewers } from '@/hooks/useUsers';
import Loader from '@/components/Loader';
import { useParams } from 'next/navigation';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import withPermissions from '@/components/WithPermission';
import { DialogTrigger } from '@radix-ui/react-dialog';

const AssignRevieweModal = () => {
  const [selectedReviewerId, setSelectedReviewerId] = useState<string>('');
  const { data: availableReviwers } = useGetReviewers();
  const { mutate, isPending } = useAssignReviewer();
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<Date>();
  const [warning, setWarning] = useState<string>('');

  const { articleId } = useParams();

  const selectedReviewer = availableReviwers?.find(
    (Reviewer) => Reviewer.id === selectedReviewerId
  );

  const handleAssign = () => {
    if (!date) {
      setWarning('Please select a due date before assigning');
      return;
    }

    if (selectedReviewer) {
      const data = {
        articleId: articleId as string,
        userId: selectedReviewer.user.id,
        reviewerName: `${selectedReviewer.user.firstName} ${selectedReviewer.user.lastName}`,
        reviewerEmail: selectedReviewer.user.email as string,
        date,
      };
      mutate(data, {
        onSettled: () => {
          setOpen(false);
          setSelectedReviewerId('');
          setDate(undefined);
          setWarning('');
        },
      });
      setWarning('');
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <Button
          variant={'ghost'}
          className="m-5"
          onClick={() => setOpen(true)}
          title="Assign Reviewer"
        >
          <UserRoundPlus size={25} />
        </Button>
        <DialogTrigger asChild></DialogTrigger>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Assign Reviewer to the Manuscript
            </DialogTitle>
            <DialogDescription>
              Select a reviewer to review this manuscript.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="font-semibold">Select Reviewer</h3>

              {availableReviwers?.length === 0 ? (
                <div className="text-center p-4 text-gray-500">
                  No reviwers available.
                </div>
              ) : (
                <>
                  <Select
                    value={selectedReviewerId}
                    onValueChange={setSelectedReviewerId}
                  >
                    <SelectTrigger>
                      <SelectValue
                        placeholder="Choose a reviewer..."
                        defaultValue=""
                      >
                        {selectedReviewer
                          ? `${selectedReviewer.user.firstName} ${selectedReviewer.user.lastName}`
                          : null}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {availableReviwers?.map((reviewer) => (
                        <SelectItem key={reviewer.id} value={reviewer.id}>
                          {reviewer.user.firstName} {reviewer.user.lastName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {selectedReviewer && (
                    <div className="border rounded-lg p-4 bg-blue-50">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle className="h-4 w-4 text-blue-600" />
                        <strong className="text-blue-800">
                          Selected reviwer
                        </strong>
                      </div>
                      <div className="space-y-1 text-sm">
                        <p>
                          <strong>Name:</strong>{' '}
                          {selectedReviewer.user.firstName}{' '}
                          {selectedReviewer.user.lastName}
                        </p>
                        <p>
                          <strong>Email:</strong> {selectedReviewer.user.email}
                        </p>
                        <p>
                          <strong>Affiliation:</strong>{' '}
                          {selectedReviewer.user.affiliation}
                        </p>
                        <p>
                          <strong>Bio:</strong>{' '}
                          {selectedReviewer.user.bio?.slice(0, 120)}...
                        </p>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
          {warning && <p className="text-sm text-red-500">{warning}</p>}
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
                disabled={(date) => date < new Date()}
                initialFocus
              />
            </PopoverContent>
          </Popover>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleAssign}
              disabled={!selectedReviewerId || isPending}
            >
              {isPending ? <Loader text="Assigning..." /> : 'Assign Reviewer'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
export const AssignRevieweModalWithPermission =
  withPermissions(AssignRevieweModal);
