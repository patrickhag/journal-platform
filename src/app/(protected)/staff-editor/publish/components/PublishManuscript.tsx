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
import { ControllerRenderProps, useForm } from 'react-hook-form';
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
import { useState } from 'react';
import { useClearURL } from '@/components/ClearURL';
import { safeParse } from 'zod-urlsearchparams';
import { filesSchema } from '@/schemas/reviewer';
import { useSearchParams } from 'next/navigation';

const publishArticleSchema = z.object({
  issueId: z.string().min(1, 'Issue is required'),
  doi: z.string().optional(),
  pageRange: z.string(),
  references: z.array(z.string().min(3)),
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
  title,
  articleId,
  pdfUrl,
  onOpenChange,
  open,
}: PublishManuscriptDialogProps) {
  const { data: issues } = useGetIssues();

  const [validateFileUploaded, setValidateFileUploaded] = useState({
    isUploaded: false,
    message: 'Please upload the required file for publication',
  });

  const form = useForm<PublishArticle>({
    resolver: zodResolver(publishArticleSchema),
    defaultValues: {
      issueId: '',
      doi: '',
      pageRange: '',
      references: [],
    },
  });

  const { mutate, isPending } = usePublishArticle();
  const searchParams = useSearchParams();

  // HANDLE FILE UPLOADS
  const filesValidation = safeParse({
    schema: filesSchema,
    input: new URLSearchParams(searchParams.toString()),
  });
  const files = filesValidation.data?.files || [];
  const fileIds = files.map((f) => f.publicId);

  const clearURL = useClearURL();

  const onSubmit = (values: PublishArticle) => {
    if (fileIds.length === 0) {
      setValidateFileUploaded((prev) => ({ ...prev, isUploaded: true }));
    }
    const payloadData = {
      articleId,
      title,
      ...values,
      issueNumber: issues?.find((issue) => issue.id === values.issueId)
        ?.issueNumber as number,
      volumeYear: issues?.find((issue) => issue.id === values.issueId)?.volume
        .year as number,
      pdfUrl: fileIds[0],
    };

    mutate(payloadData, {
      onSuccess: () => {
        form.reset();
        onOpenChange(false);
        clearURL();
      },
    });
  };

  const references = form.watch('references');

  const [referenceDraft, setReferenceDraft] = useState('');

  const addReference = (
    field: ControllerRenderProps<PublishArticle, 'references'>
  ) => {
    const trimmed = referenceDraft.trim();
    if (!trimmed) return;
    if (field.value.length >= 20) return;
    if (field.value.includes(trimmed)) return;

    field.onChange([...field.value, trimmed]);
    setReferenceDraft('');
  };

  const removeReference = (
    field: ControllerRenderProps<PublishArticle, 'references'>,
    reference: string
  ) => {
    field.onChange(field.value.filter((item) => item !== reference));
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-2xl overflow-y-auto"
      >
        <SheetHeader className="flex-shrink-0">
          <SheetTitle>Approve Manuscript</SheetTitle>
          <SheetDescription className="line-clamp-2">
            Enter the publication details for &quot;{title}&quot;.
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto overflow-x-hidden pr-4">
          <p className="pt-2">
            Annotate PDF File <span className="text-red-500">*</span>
          </p>
          {validateFileUploaded.isUploaded && (
            <p className="text-sm">{validateFileUploaded.message}</p>
          )}
          {fileIds.length === 0 && <DragAndDropFileInput />}
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
                    <FormLabel>
                      Issue <span className="text-red-500">*</span>
                    </FormLabel>
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

              <FormField
                control={form.control}
                name="references"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel htmlFor="references">
                        References <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <div>
                          <div className="flex flex-wrap gap-2 mb-2">
                            {references.map((ref, idx) => (
                              <span
                                key={ref + idx}
                                className="flex items-center gap-2 rounded-full bg-muted px-3 py-1 text-sm"
                              >
                                {ref}
                                <button
                                  type="button"
                                  className="text-muted-foreground hover:text-destructive"
                                  onClick={() => removeReference(field, ref)}
                                >
                                  ×
                                </button>
                              </span>
                            ))}
                          </div>
                          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                            <Input
                              value={referenceDraft}
                              onChange={(e) =>
                                setReferenceDraft(e.target.value)
                              }
                              placeholder="Add a reference"
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  e.preventDefault();
                                  addReference(field);
                                }
                              }}
                            />
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => addReference(field)}
                            >
                              Add reference
                            </Button>
                          </div>
                          {references.length >= 20 && (
                            <p className="text-sm text-muted-foreground">
                              Maximum of 20 references added.
                            </p>
                          )}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
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
        </div>
      </SheetContent>
    </Sheet>
  );
}
