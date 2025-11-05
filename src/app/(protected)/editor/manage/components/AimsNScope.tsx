'use client';

import { TabsContent } from '@/components/ui/tabs';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/file-upload';
import { RichTextEditor } from '@/components/RichTextEditor';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCreateManuals, useGetManuals } from '@/hooks/useSettings';
import Loader from '@/components/Loader';
import { useEffect } from 'react';

const aimsNscopeSchema = z.object({
  content: z.string().min(10, 'Content must be at least 10 characters'),
});

export default function AimsNScope() {
  const { data: manualData } = useGetManuals();

  useEffect(() => {
    if (manualData?.aimsNscope) {
      form.setValue('content', manualData.aimsNscope.content || '');
    }
  }, [manualData]);

  const { mutate: createManualMutation, isPending } = useCreateManuals();

  const form = useForm({
    resolver: zodResolver(aimsNscopeSchema),
    defaultValues: {
      content: '',
    },
  });

  const onSubmit = (data: z.infer<typeof aimsNscopeSchema>) => {
    createManualMutation({ aimsNscope: data });
  };

  return (
    <TabsContent value="aimsNscope" className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Card>
            <CardHeader>
              <CardTitle>Aims and Scope of JAEPH</CardTitle>
              <CardDescription>
                Add or modify aims and scope page.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
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
                        placeholder="Our aims and scope refers to..."
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? <Loader text="Saving..." /> : 'Save changes'}
              </Button>
            </CardContent>
          </Card>
        </form>
      </Form>
    </TabsContent>
  );
}
