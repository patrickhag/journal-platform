'use client';

import { Button } from '@/components/ui/button';
import { Pencil } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useRouter, useSearchParams } from 'next/navigation';
import { useUpdateManuscriptFiles } from '@/hooks/useUpdateMetadata';
import { useState } from 'react';
import { DragAndDropFileInput } from '../upload/FileInput';
import { FileList } from '../upload/FileList';
import { safeParse } from 'zod-urlsearchparams';
import { filesSchema } from '@/schemas/reviewer';
import Loader from '../Loader';
import { useClearURL } from '../ClearURL';

export default function AddArticleFiles({
  userId,
  articleId,
}: {
  userId: string;
  articleId: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const searchParams = useSearchParams();

  const filesValidation = safeParse({
    schema: filesSchema,
    input: new URLSearchParams(searchParams.toString()),
  });

  const files = filesValidation.data?.files || [];

  const { mutate, isPending } = useUpdateManuscriptFiles(articleId);
  const clearUrl = useClearURL();

  const onSubmit = () => {
    const payloadData = {
      userId,
      updatedFiles: files,
    };

    mutate(payloadData, {
      onSettled: () => {
        clearUrl();
        setIsOpen(false);
        router.refresh();
      },
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant={'ghost'} className="m-5">
          <Pencil size={25} />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit article info</DialogTitle>
          <DialogDescription>
            Add revised/updated manuscript files here.
          </DialogDescription>
        </DialogHeader>
        <FileList isEditNeeded={true} />
        <DragAndDropFileInput />
        <Button
          type="submit"
          onClick={onSubmit}
          disabled={isPending || files.length === 0}
        >
          {isPending ? <Loader text="Adding..." /> : 'Add File(s)'}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
