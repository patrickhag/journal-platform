'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { TabsContent } from '@/components/ui/tabs';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import { RichTextEditor } from '@/components/RichTextEditor';
import { useCreateManuals, useGetManuals } from '@/hooks/useSettings';
import Loader from '@/components/Loader';
import { useEffect } from 'react';
import { DragAndDropFileInput } from '@/components/upload/FileInput';
import { FileList } from '@/components/upload/FileList';
import { filesSchema } from '@/schemas/reviewer';
import { useSearchParams } from 'next/navigation';
import { safeParse } from 'zod-urlsearchparams';
import { useClearURL } from '@/components/ClearURL';

const formSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  content: z.string().min(1, 'Content is required'),
});

export default function Guidelines() {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      content: '',
    },
  });
  const searchParams = useSearchParams();

  const filesValidation = safeParse({
    schema: filesSchema,
    input: new URLSearchParams(searchParams.toString()),
  });

  const files = filesValidation.data?.files || [];
  const fileIds = files.map((f) => f.publicId);
  const fileId = fileIds[0];

  const { data: manualData, isPending: isGettingManualsPending } =
    useGetManuals();

  useEffect(() => {
    if (manualData?.guidelines) {
      form.setValue('content', manualData.guidelines.content || '');
    }
  }, [manualData]);

  const { mutate: createManualMutation, isPending } = useCreateManuals();
  const clearUrl = useClearURL();

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    createManualMutation(
      { guidelines: data, paperTemplate: fileId },
      {
        onSettled: () => {
          clearUrl();
        },
      }
    );
  };

  return (
    <TabsContent value="guidelines" className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Submission Guidelines</CardTitle>
          <CardDescription>
            Update the journal&apos;s submission guidelines and requirements
          </CardDescription>
        </CardHeader>
        {isGettingManualsPending ? (
          <Loader text="Loading manuals..." />
        ) : (
          <CardContent>
            <div className="space-y-3 mb-4">
              <p className="text-sm mb-4">Upload paper template</p>
              <DragAndDropFileInput />
              <FileList isEditNeeded />
            </div>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem className="mb-4">
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Manuscript Submission Guidelines goes here"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="content"
                  render={() => (
                    <FormItem>
                      <FormLabel>Content</FormLabel>
                      <FormControl>
                        <RichTextEditor
                          description={form.getValues().content}
                          onChange={(d) => {
                            form.setValue('content', d);
                          }}
                          placeholder="Authors should follow these guidelines when preparing their manuscripts..."
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full my-3"
                  disabled={isPending}
                >
                  {isPending ? (
                    <Loader text="Modifying..." />
                  ) : (
                    'Save Guidelines'
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        )}
      </Card>
    </TabsContent>
  );
}
