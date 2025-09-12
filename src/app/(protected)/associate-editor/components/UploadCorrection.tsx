'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import { useSearchParams } from 'next/navigation';
import { safeParse } from 'zod-urlsearchparams';
import { filesSchema } from '@/schemas/reviewer';

import { useSubmitCollection } from '@/hooks/useReviews';
import Loader from '@/components/Loader';
import { useClearURL } from '@/components/ClearURL';
import { DragAndDropFileInput } from '@/components/upload/FileInput';
import { FileList } from '@/components/upload/FileList';
import { Dispatch, SetStateAction } from 'react';
import { TAssociateEditorAssignments } from '@/types';

export default function UploadCorrection({
  open,
  setOpenSubmitCollection,
  selectedAssignment,
}: {
  open: boolean;
  setOpenSubmitCollection: Dispatch<SetStateAction<boolean>>;
  selectedAssignment: TAssociateEditorAssignments | null;
}) {
  const searchParams = useSearchParams();

  const filesValidation = safeParse({
    schema: filesSchema,
    input: new URLSearchParams(searchParams.toString()),
  });

  const files = filesValidation.data?.files || [];
  const fileIds = files.map((f) => f.publicId);

  const { mutate, isPending } = useSubmitCollection();

  const clearURL = useClearURL();

  const staffEditorName =
    selectedAssignment?.staffEditor.firstName +
    ' ' +
    selectedAssignment?.staffEditor.lastName;
  const staffEditorEmail = selectedAssignment?.staffEditor.email;
  const articleTitle = selectedAssignment?.articleSubmissions.metadata.title;
  const articleId = selectedAssignment?.articleSubmissions.id;

  const onSubmit = () => {
    const data = {
      fileIds,
      articleId: articleId as string,
      staffEditorName,
      staffEditorEmail,
      articleTitle,
    };
    mutate(data, {
      onSettled: () => {
        setOpenSubmitCollection(false);
        clearURL();
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpenSubmitCollection}>
      <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold text-[#1a237e]">
            Submit a collection
          </DialogTitle>
        </DialogHeader>
        <div className="text-sm">Annotate file(s)</div>
        <DragAndDropFileInput />
        <FileList isEditNeeded={true} />

        <div className="space-y-3">
          <Button
            type="submit"
            disabled={isPending}
            onClick={onSubmit}
            className="bg-indigo-500 hover:bg-indigo-600 w-full"
          >
            {isPending ? <Loader text="Submitting..." /> : 'Submit Correction'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
