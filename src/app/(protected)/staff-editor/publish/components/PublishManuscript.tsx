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
import { usePublishArticle } from '@/hooks/useArticles';
import Loader from '@/components/Loader';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import { FileText } from 'lucide-react';

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
  pdfUrl: string;
}

export default function PublishManuscriptDialog({
  open,
  onOpenChange,
  title,
  articleId,
  pdfUrl,
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

  const { mutate, isPending } = usePublishArticle();

  const onSubmit = (values: PublishArticle) => {
    const payloadData = {
      articleId,
      title,
      ...values,
      issueNumber: issues?.find((issue) => issue.id === values.issueId)
        ?.issueNumber as number,
      volumeYear: issues?.find((issue) => issue.id === values.issueId)?.volume
        .year as number,
    };

    mutate(payloadData, {
      onSuccess: () => {
        onOpenChange(false);
      },
    });
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-2xl flex flex-col h-full"
      >
        <SheetHeader>
          <SheetTitle>Approve Manuscript</SheetTitle>
          <SheetDescription className="line-clamp-2">
            Enter the publication details for &quot;{title}&quot;.
          </SheetDescription>
        </SheetHeader>

        <p className="pt-2">
          Annotate PDF File <span className="text-red-500">*</span>
        </p>
        <DragAndDropFileInput />
        <FileList isEditNeeded />

        {pdfUrl && (
          <div className="pt-4">
            <div className="pt-2">
              <p className="text-sm font-medium mb-2">Forwarded PDF File</p>
              <div className="w-full">
                <div className="space-y-2">
                  <div className="flex items-center justify-between rounded-lg border border-border bg-card px-4 py-3">
                    <div className="flex items-center gap-3">
                      <FileText className="h-6 w-6 text-blue-500" />
                      <div className="text-sm">
                        <a
                          href={pdfUrl}
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
        )}

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
