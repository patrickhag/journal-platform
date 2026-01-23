'use client';

import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Label } from '@/components/ui/label';

import { useSearchParams } from 'next/navigation';
import { safeParse } from 'zod-urlsearchparams';
import { filesSchema } from '@/schemas/reviewer';

import { useSubmitCollection } from '@/hooks/useReviews';
import Loader from '@/components/Loader';
import { useClearURL } from '@/components/ClearURL';
import { DragAndDropFileInput } from '@/components/upload/FileInput';
import { FileList } from '@/components/upload/FileList';
import { Dispatch, SetStateAction, useState } from 'react';
import { TAssociateAssignment } from '@/types';
import { RichTextEditor } from '@/components/RichTextEditor';

export default function UploadCorrection({
  open,
  setOpenSubmitCollection,
  selectedAssignment,
}: {
  open: boolean;
  setOpenSubmitCollection: Dispatch<SetStateAction<boolean>>;
  selectedAssignment: TAssociateAssignment | undefined;
}) {
  const searchParams = useSearchParams();
  const filesValidation = safeParse({
    schema: filesSchema,
    input: new URLSearchParams(searchParams.toString()),
  });

  const files = filesValidation.data?.files || [];
  const fileIds = files.map((f) => f.publicId);
  const fileId = fileIds[0];

  const [message, setMessage] = useState('');

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
      fileId,
      articleId: articleId as string,
      staffEditorName,
      staffEditorEmail,
      articleTitle,
      message: message.trim() || undefined,
    };
    mutate(data, {
      onSettled: () => {
        setOpenSubmitCollection(false);
        setMessage('');
        clearURL();
      },
    });
  };

  return (
    <Sheet open={open} onOpenChange={setOpenSubmitCollection}>
      <SheetContent className="sm:max-w-[550px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-2xl font-semibold text-[#1a237e]">
            Submit a correction
          </SheetTitle>
        </SheetHeader>
        <div className="mt-6 space-y-6">
          <div className="space-y-2">
            <div className="text-sm font-medium">Annotate file(s)</div>
            <DragAndDropFileInput />
            <FileList isEditNeeded={true} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Message (Optional)</Label>
            <RichTextEditor
              description={message}
              onChange={(value) => setMessage(value)}
              placeholder="Add a note or message to the Associate Editor"
            />
          </div>

          <div className="space-y-3">
            <Button
              type="submit"
              disabled={isPending || files.length === 0}
              onClick={onSubmit}
              className="bg-indigo-500 hover:bg-indigo-600 w-full"
            >
              {isPending ? (
                <Loader text="Submitting..." />
              ) : (
                'Submit Correction'
              )}
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
