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
import { Uploadbanner } from '../upload/Uploadbanner';
import { fileFormats } from '@/lib/consts';
import { FileList } from '../upload/FileList';
import { useParams, useSearchParams } from 'next/navigation';
import { safeParse } from 'zod-urlsearchparams';
import { filesSchema } from '@/schemas/reviewer';
import Spinner from '../Spinner';
import { submitReviewAction } from '@/actions/submitReviewAction';
import { ARTICLE_STATUS } from '@/lib/consts';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';

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
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold text-[#1a237e]">
            Write a review
          </DialogTitle>
        </DialogHeader>
        <Uploadbanner fileFormats={fileFormats} />
        <FileList />
        <form action={formAction} className="mt-6 space-y-6">
          <div className="space-y-2">
            <label htmlFor="message" className="text-xl font-medium">
              Leave a message
            </label>
            <Textarea
              id="message"
              name="message"
              placeholder="What's your thoughts on this article?"
              className="min-h-[150px] resize-none p-4 text-gray-500 bg-white rounded-lg"
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
          <input
            type="hidden"
            name="status"
            defaultValue={status || reviewStatus[0]}
          />
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

          {/* 
          
           
          */}

          <div className="space-y-3">
            <Button
              disabled={isPending}
              className="bg-indigo-500 hover:bg-indigo-600 block w-full"
            >
              Submit {isPending && <Spinner />}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
