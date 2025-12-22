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
import { useClearURL } from '@/components/ClearURL';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetClose,
} from '@/components/ui/sheet';
import { useEffect, useState } from 'react';
import { TPublishedArticle } from '@/types';
import { publishedArticlesStatus } from '@/lib/consts';
import { useUpdatePublishedArticle } from '@/hooks/useArticles';
import Loader from '@/components/Loader';
import { FileText } from 'lucide-react';

const editPublishedArticleSchema = z.object({
  issueId: z.string(),
  doi: z.string().optional(),
  pageRange: z.string(),
  status: z.string(),
});

type EditPublishedArticle = z.infer<typeof editPublishedArticleSchema>;

interface EditPublishedManuscriptProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  publishedArticle: TPublishedArticle | null;
}

export default function EditPublishedManuscript({
  open,
  onOpenChange,
  publishedArticle,
}: EditPublishedManuscriptProps) {
  const { data: issues } = useGetIssues();

  const form = useForm<EditPublishedArticle>({
    resolver: zodResolver(editPublishedArticleSchema),
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

  const { mutate, isPending } = useUpdatePublishedArticle(clearUrl);
  const [fileError, setFileError] = useState('');

  useEffect(() => {
    if (publishedArticle) {
      form.reset({
        issueId: publishedArticle.issue.id || '',
        doi: publishedArticle.doi || '',
        pageRange: publishedArticle.pageRange || '',
        status: publishedArticle.status,
      });
    }
  }, [publishedArticle, form]);

  const onSubmit = (values: EditPublishedArticle) => {
    if (!publishedArticle) return;

    // If files are uploaded, validate them
    if (files.length > 0 && !fileIds.length) {
      setFileError('You must upload a valid file.');
      return;
    }

    setFileError('');

    const payloadData = {
      publishedArticleId: publishedArticle.id,
      articleId: publishedArticle.article.id,
      title: publishedArticle.article.metadata.title,
      ...(fileIds.length > 0 && { pdfUrl: fileIds[0] }),
      ...values,
    };

    mutate(payloadData);
  };

  const handleClose = () => {
    onOpenChange(false);
    setFileError('');
  };

  return (
    <Sheet open={open} onOpenChange={handleClose}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-2xl flex flex-col h-full"
      >
        <SheetHeader>
          <SheetTitle>Edit Published Article</SheetTitle>
        </SheetHeader>

        <div className="space-y-4 py-4">
          <div>
            <p className="text-sm font-medium">Update PDF File</p>
            <p className="text-xs text-muted-foreground mb-2">
              Leave empty to keep current file, or Upload the new one
            </p>
            <DragAndDropFileInput />
            <FileList isEditNeeded />
            {fileError && (
              <p className="text-sm text-red-500 mt-2">{fileError}</p>
            )}
          </div>

          <div className="pt-4">
            <div className="pt-2">
              <p className="text-sm font-medium mb-2">Published PDF File</p>
              <div className="w-full">
                <div className="space-y-2">
                  <div className="flex items-center justify-between rounded-lg border border-border bg-card px-4 py-3">
                    <div className="flex items-center gap-3">
                      <FileText className="h-6 w-6 text-blue-500" />
                      <div className="text-sm">
                        <a
                          href={publishedArticle?.pdfUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-medium text-blue-700 hover:underline break-all"
                        >
                          PDF file
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status of the article</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Change the status of article" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {publishedArticlesStatus?.map((status, index) => (
                          <SelectItem key={index} value={status}>
                            {status}
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
                      <Input
                        {...field}
                        placeholder="10.1234/journal.2024.001"
                      />
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
              <SheetFooter>
                <SheetClose asChild>
                  <Button variant="outline">Cancel</Button>
                </SheetClose>
                <Button type="submit" disabled={isPending}>
                  {isPending ? <Loader text="Updating..." /> : 'Update Article'}
                </Button>
              </SheetFooter>
            </form>
          </Form>
        </div>
      </SheetContent>
    </Sheet>
  );
}
