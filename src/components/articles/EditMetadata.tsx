'use client';

import { Button } from '@/components/ui/button';
import { Pencil } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { metadataSchema } from '../upload/ContributorsForm';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/file-upload';
import { useRouter } from 'next/navigation';
import { useUpdateMetadata } from '@/hooks/useUpdateMetadata';
import Loader from '../Loader';
import { useState } from 'react';
import { RichTextEditor } from '../RichTextEditor';

export default function EditMetadata({
  articleId,
  meta,
}: {
  articleId: string;
  meta: z.infer<typeof metadataSchema>;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const form = useForm<z.infer<typeof metadataSchema>>({
    resolver: zodResolver(metadataSchema),
    defaultValues: {
      title: meta?.title || '',
      prefix: meta?.prefix || '',
      subtitle: meta?.subtitle || '',
      abstract: meta?.abstract || '',
      topics: meta?.topics || [],
    },
  });

  const { mutate: updateMetadata, isPending } = useUpdateMetadata(setIsOpen);

  const onSubmit = (data: z.infer<typeof metadataSchema>) => {
    updateMetadata(
      { id: articleId, data },
      { onSettled: () => router.refresh() }
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant={'ghost'} className="m-5">
          <Pencil size={25} />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit article info</DialogTitle>
          <DialogDescription>
            Modify the article metadata here.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid gap-4 py-4"
          >
            <FormField
              control={form.control}
              name="prefix"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="prefix">Prefix</FormLabel>
                  <FormControl>
                    <Input id="prefix" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="title">Title</FormLabel>
                  <FormControl>
                    <Input id="title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="subtitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="subtitle">Subtitle</FormLabel>
                  <FormControl>
                    <Input id="subtitle" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="abstract"
              render={() => (
                <FormItem>
                  <FormLabel htmlFor="abstract">Abstract</FormLabel>
                  <FormControl>
                    <RichTextEditor
                      description={form.getValues().abstract}
                      onChange={(d) => {
                        form.setValue('abstract', d);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" disabled={isPending}>
                {isPending ? <Loader text="Saving..." /> : 'Save changes'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
