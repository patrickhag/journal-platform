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

  const { data: manualData } = useGetManuals();

  useEffect(() => {
    if (manualData?.guidelines) {
      form.setValue('title', manualData.guidelines.title || '');
      form.setValue('content', manualData.guidelines.content || '');
    }
  }, [manualData]);

  const { mutate: createManualMutation, isPending } = useCreateManuals();

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    createManualMutation({ guidelines: data });
  };

  return (
    <TabsContent value="guidelines" className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Card>
            <CardHeader>
              <CardTitle>Submission Guidelines</CardTitle>
              <CardDescription>
                Update the journal&apos;s submission guidelines and requirements
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
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
                render={({ field }) => (
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
                {isPending ? <Loader text="Modifying..." /> : 'Save Guidelines'}
              </Button>
            </CardContent>
          </Card>
        </form>
      </Form>
    </TabsContent>
  );
}
