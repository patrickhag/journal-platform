'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
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
} from '@/components/ui/file-upload';
import { Textarea } from '@/components/ui/textarea';
import { ProofFormValues, proofSchema } from '@/lib/schemas';
import { useCreateProof } from '@/hooks/useProofs';
import Loader from '../Loader';
import { DragAndDropFileInput } from '../upload/FileInput';
import { FileList } from '../upload/FileList';
import { safeParse } from 'zod-urlsearchparams';
import { filesSchema } from '@/schemas/reviewer';
import { useSearchParams, useRouter } from 'next/navigation';
import { Dispatch, SetStateAction } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { PROOF_STATUS } from '@/lib/consts';
import { RichTextEditor } from '../RichTextEditor';

interface ProofModalProps {
  open: boolean;
  onOpenChange: Dispatch<SetStateAction<boolean>>;
  articleId: string;
}

export function CreateProofModal({
  open,
  onOpenChange,
  articleId,
}: ProofModalProps) {
  const form = useForm<ProofFormValues>({
    resolver: zodResolver(proofSchema),
  });

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

  const { mutate, isPending } = useCreateProof(onOpenChange, cleanupUrl);

  const onSubmit = (data: ProofFormValues) => {
    const apiData = {
      ...data,
      fileIds,
      articleId,
    };
    mutate(apiData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Send Article Proof</DialogTitle>
        </DialogHeader>
        <DragAndDropFileInput />
        <FileList isEditNeeded={true} />

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Message to Author</FormLabel>
                  <FormControl>
                    {/* <Textarea
                      className="h-24"
                      placeholder="Add comments, revision requests, or context for the author..."
                      {...field}
                    /> */}
                    <RichTextEditor
                      description={field.value}
                      onChange={(d) => {
                        form.setValue('message', d);
                      }}
                      placeholder="Add comments, revision requests, or context for the author..."
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
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
                      {PROOF_STATUS.map((item) => (
                        <SelectItem key={item} value={item}>
                          {item}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button disabled={isPending} type="submit">
              {isPending ? <Loader text="Uploading" /> : 'Upload & Notify'}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
