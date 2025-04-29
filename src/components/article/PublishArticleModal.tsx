'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Dispatch, SetStateAction } from 'react';
import { DragAndDropFileInput } from '../upload/FileInput';
import { FileList } from '../upload/FileList';
import { useRouter, useSearchParams } from 'next/navigation';
import { safeParse } from 'zod-urlsearchparams';
import { filesSchema } from '@/schemas/reviewer';
import { usePublishArticle } from '@/hooks/usePublishArticle';
import Loader from '../Loader';

interface IPublishArticleDialog {
  open: boolean;
  onOpenChange: Dispatch<SetStateAction<boolean>>;
  articleId: string;
}

export function PublishArticleDialog({
  open,
  onOpenChange,
  articleId,
}: IPublishArticleDialog) {
  const searchParams = useSearchParams();

  const filesValidation = safeParse({
    schema: filesSchema,
    input: new URLSearchParams(searchParams.toString()),
  });

  const router = useRouter();

  const files = filesValidation.data?.files || [];
  const fileIds = files.map((f) => f.publicId);

  const cleanupUrl = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete('files');
    router.replace(`?${params.toString()}`);
  };

  const { mutate, isPending } = usePublishArticle(onOpenChange, cleanupUrl);

  const handlePublish = () => {
    mutate({ articleId, data: fileIds });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Publish this article</DialogTitle>
          <DialogDescription>
            Upload the final proofed & formatted file to be published.
          </DialogDescription>
        </DialogHeader>
        <DragAndDropFileInput />
        <FileList isEditNeeded={true} />
        <DialogFooter>
          <Button type="submit" onClick={handlePublish} disabled={isPending}>
            {isPending ? <Loader text="Publishing..." /> : 'Publish'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
