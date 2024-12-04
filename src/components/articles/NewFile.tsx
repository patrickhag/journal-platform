"use client";
import { useActionState, useState } from 'react';
import { Uploadbanner } from '../upload/Uploadbanner'
import { fileFormats } from '@/lib/consts'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { FileList } from '../upload/FileList';
import { Button } from '../ui/button';
import { useParams, useSearchParams } from 'next/navigation';
import { safeParse } from 'zod-urlsearchparams';
import { filesSchema } from '@/schemas/reviewer';
import Spinner from '../Spinner';
import { attachFile } from '@/lib/submitionAction';

export const NewFile = () => {
  const [open, setOpen] = useState(false)
  const [, formAction, isPending] = useActionState(
    attachFile,
    undefined,
  );
  const searchParams = useSearchParams();
  const { articleId } = useParams()
  const filesValidation = safeParse({
    schema: filesSchema,
    input: new URLSearchParams(searchParams.toString()),
  });
  return (
    <div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="text-blue-500 hover:text-blue-600">
            Attach files
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-2xl font-semibold text-[#1a237e]">Attach new files</DialogTitle>
            <DialogDescription className="text-gray-500">
              Lorem ipsum dolor sit amet Lorem ipsum dolor sit amet Lorem ipsum
            </DialogDescription>
          </DialogHeader>
          <Uploadbanner fileFormats={fileFormats} />
          <FileList />
          <form action={formAction} className="mt-6 space-y-6">
            <input type="text" name="files" id="files" value={JSON.stringify(filesValidation.data)} readOnly className="hidden" />
            <input type="text" name="articleId" id="articleId" value={articleId} readOnly className="hidden" />

            <div className="space-y-3">

              <Button disabled={isPending} className="bg-[#626EEF]">
                Submit {isPending && <Spinner />}
              </Button>
            </div>
          </form>

        </DialogContent>
      </Dialog>
    </div>
  )
}
