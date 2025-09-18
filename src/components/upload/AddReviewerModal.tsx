'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { reviewerSchema } from '@/schemas/reviewer';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useActionState, useState, useTransition } from 'react';
import { safeParse, serialize } from 'zod-urlsearchparams';
import { addReviewerAction } from '@/actions/addReviewer';
import Loader from '../Loader';

type ReviewerFormValues = z.infer<typeof reviewerSchema>;

type ReviewerActionResult = {
  success: boolean;
  message: string;
};

export default function AddReviewerModal({
  typeOfPage,
  autoSave,
}: {
  typeOfPage?: string;
  autoSave?: boolean;
}) {
  const form = useForm<ReviewerFormValues>({
    resolver: zodResolver(reviewerSchema),
    defaultValues: {
      names: '',
      affiliation: '',
      email: '',
      phone: '',
      expertise: '',
    },
  });

  const router = useRouter();
  const searchParams = useSearchParams();

  const [open, setOpen] = useState(false);
  const reviewersValidation = safeParse({
    schema: z.object({
      reviewers: z.array(reviewerSchema),
    }),
    input: new URLSearchParams(searchParams.toString()),
  });

  const [isPending, startTransition] = useTransition();

  const reviewers = reviewersValidation.data?.reviewers || [];
  const [, formAction] = useActionState<
    ReviewerActionResult,
    z.infer<typeof reviewerSchema> & { articleId: string }
  >(addReviewerAction, { success: false, message: '' });

  const { articleId } = useParams();

  async function handleSubmit(data: ReviewerFormValues) {
    if (autoSave && articleId) {
      const res = await addReviewerAction(undefined, {
        ...data,
        articleId: articleId as string,
      });
      if (res.success) {
        form.reset();
        setOpen(false);
      }
    }

    reviewers.push(data);
    const serializedData = serialize({
      data: { reviewers },
      schema: z.object({
        reviewers: z.array(reviewerSchema),
      }),
    });

    const params = new URLSearchParams(searchParams.toString());
    params.delete('reviewers');
    router.replace(`?${params.toString()}&${serializedData.toString()}`);

    form.reset();
    setOpen(false);
  }

  return (
    <>
      <Button
        variant={typeOfPage === 'review' ? 'link' : 'outline'}
        className={
          typeOfPage === 'review'
            ? 'text-blue-500 hover:text-blue-600 underline'
            : ''
        }
        onClick={() => setOpen(true)}
      >
        Add a reviewer
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Reviewer</DialogTitle>
            <p className="text-sm text-muted-foreground">
              * Denotes a required field
            </p>
          </DialogHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-4"
            >
              <FormField
                control={form.control}
                name="names"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Names <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Full names of the reviewer"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="affiliation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Affiliation <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="e.g: Organisation" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Email <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="Email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone number</FormLabel>
                    <FormControl>
                      <Input placeholder="Phone number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="expertise"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Expertise or Relevance{' '}
                      <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., Machine Learning, Data Science (comma-separated)"
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end gap-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isPending}>
                  {isPending ? <Loader text="Adding..." /> : 'Add'}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}
