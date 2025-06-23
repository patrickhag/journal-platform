'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
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
import { ARTICLE_STATUS } from '@/lib/consts';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { DragAndDropFileInput } from '../upload/FileInput';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { reviewSchema, ReviewFormData } from '@/schemas/reviewer';
import { useCreateReview } from '@/hooks/useReviews';
import Loader from '../Loader';

export default function ReviewModal() {
  const [open, setOpen] = useState(false);
  const searchParams = useSearchParams();
  const { articleId } = useParams();

  const filesValidation = safeParse({
    schema: filesSchema,
    input: new URLSearchParams(searchParams.toString()),
  });

  const files = filesValidation.data?.files || [];
  const fileIds = files.map((f) => f.publicId);

  const reviewStatus: (typeof ARTICLE_STATUS)[number][] = [
    'MAJOR ISSUE',
    'MINOR ISSUE',
    'ACCEPTED',
    'REJECTED',
  ];

  const form = useForm<ReviewFormData>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      message: '',
      articleId: articleId as string,
      fileIds,
      status: undefined,
    },
  });

  const { handleSubmit } = form;

  const { mutate: createReviewMutation, isPending } = useCreateReview(setOpen);

  const onSubmit = (data: ReviewFormData) => {
    createReviewMutation(data);
  };

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
        <div className="text-sm">Annotate file(s)</div>
        <DragAndDropFileInput />
        <FileList isEditNeeded={true} />

        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-6">
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Feedback</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="General feedback on this manuscript?"
                      className="min-h-[100px] resize-none p-4 bg-white rounded-lg"
                      {...field}
                      hidden
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <input
              type="hidden"
              value={articleId}
              {...form.register('articleId')}
            />
            <input
              type="hidden"
              value={JSON.stringify(fileIds)}
              {...form.register('fileIds')}
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select article status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {reviewStatus.map((status) => (
                        <SelectItem key={status} value={status}>
                          {status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-3">
              <Button
                type="submit"
                disabled={isPending}
                className="bg-indigo-500 hover:bg-indigo-600 w-full"
              >
                {isPending ? <Loader text="Submitting..." /> : 'Submit Review'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
