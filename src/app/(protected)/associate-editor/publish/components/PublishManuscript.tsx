'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { useGetIssues } from '@/hooks/usePublishArticle';

import { DragAndDropFileInput } from '@/components/upload/FileInput';
import { FileList } from '@/components/upload/FileList';
import { useSearchParams } from 'next/navigation';
import { safeParse } from 'zod-urlsearchparams';
import { filesSchema } from '@/schemas/reviewer';
import { usePublishArticle } from '@/hooks/useArticles';
import { useClearURL } from '@/components/ClearURL';
import Loader from '@/components/Loader';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import { useState } from 'react';

const publishArticleSchema = z.object({
  issueId: z.string().min(1, 'Issue is required'),
  doi: z.string().optional(),
  pageRange: z.string(),
});

type PublishArticle = z.infer<typeof publishArticleSchema>;

interface PublishManuscriptDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  articleId: string;
}

export default function PublishManuscriptDialog({
  open,
  onOpenChange,
  title,
  articleId,
}: PublishManuscriptDialogProps) {
  const { data: issues } = useGetIssues();

  const form = useForm<PublishArticle>({
    resolver: zodResolver(publishArticleSchema),
    defaultValues: {
      issueId: '',
      doi: '',
      pageRange: '',
    },
  });

  const searchParams = useSearchParams();

  const filesValidation = safeParse({
    schema: filesSchema,
    input: new URLSearchParams(searchParams.toString()),
  });

  const files = filesValidation.data?.files || [];
  const fileIds = files.map((f) => f.publicId);

  const clearUrl = useClearURL();

  const { mutate, isPending } = usePublishArticle(clearUrl);
  const [fileError, setFileError] = useState('');

  const onSubmit = (values: PublishArticle) => {
    if (!fileIds.length) {
      setFileError('You must upload a file before publishing.');
      return;
    }

    setFileError('');
    const payloadData = {
      pdfUrl: fileIds[0],
      articleId,
      title,
      ...values,
    };
    mutate(payloadData);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-[500px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle>Approve Manuscript</SheetTitle>
          <SheetDescription>
            Enter the publication details for &quot;{title}&quot;.
          </SheetDescription>
        </SheetHeader>

        <p className="pt-2">
          Annotate PDF File <span className="text-red-500">*</span>
        </p>
        <DragAndDropFileInput />
        <FileList isEditNeeded />
        {fileError && <p className="text-sm text-red-500 mt-2">{fileError}</p>}

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 py-4"
          >
            <FormField
              control={form.control}
              name="issueId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Issue</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an issue" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {issues?.map((issue) => (
                        <SelectItem key={issue.id} value={issue.id}>
                          Issue {issue.issueNumber}, {issue.volume.year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="doi"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="doi">DOI</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="10.1234/journal.2024.001" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="pageRange"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="pageRange">Page Range</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="1–15" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? (
                  <Loader text="Approving..." />
                ) : (
                  'Approve Manuscript'
                )}
              </Button>
            </div>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
