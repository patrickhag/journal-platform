'use client';

import { useActionState, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { FileList } from '../upload/FileList';
import { useParams, useSearchParams } from 'next/navigation';
import { safeParse } from 'zod-urlsearchparams';
import { filesSchema } from '@/schemas/reviewer';
import { submitReviewAction } from '@/actions/submitReviewAction';
import { ARTICLE_STATUS } from '@/lib/consts';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { DragAndDropFileInput } from '../upload/FileInput';
import Loader from '../Loader';

export default function ReviewModal() {
  const [open, setOpen] = useState(false);
  const [, formAction, isPending] = useActionState(
    submitReviewAction,
    undefined
  );
  const searchParams = useSearchParams();
  const { articleId } = useParams();
  const filesValidation = safeParse({
    schema: filesSchema,
    input: new URLSearchParams(searchParams.toString()),
  });

  const files = filesValidation.data?.files || [];

  const reviewStatus: (typeof ARTICLE_STATUS)[number][] = [
    'Major issue',
    'Minor issue',
    'Accepted',
    'Rejected',
  ];
  const [status, setStatus] = useState('');

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="link"
          className="text-blue-500 hover:text-blue-600 px-0 underline"
        >
          Add a review
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold text-[#1a237e]">
            Write a review
          </DialogTitle>
        </DialogHeader>
        <div className="text-sm font-semibold">Annotate file(s)</div>
        <DragAndDropFileInput />
        <FileList />
        <form action={formAction} className="mt-6 space-y-6">
          <div className="space-y-2">
            <Textarea
              id="message"
              name="message"
              placeholder="General feedback on this manuscript?"
              className="min-h-[150px] resize-none p-4 bg-white rounded-lg"
            />
          </div>
          <input
            type="text"
            name="fileIds"
            id="fileIds"
            value={JSON.stringify(files.map((f) => f.publicId))}
            readOnly
            className="hidden"
          />
          <input
            type="text"
            name="articleId"
            id="articleId"
            value={articleId}
            readOnly
            className="hidden"
          />
          <input type="hidden" name="status" defaultValue={status} />
          <Select onValueChange={(value) => setStatus(value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select article status" />
            </SelectTrigger>
            <SelectContent>
              {reviewStatus.map((status) => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="space-y-3">
            <Button
              disabled={isPending || status === ''}
              className="bg-indigo-500 hover:bg-indigo-600 block w-full"
            >
              {isPending ? <Loader text="Submitting..." /> : 'Submit Review'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
