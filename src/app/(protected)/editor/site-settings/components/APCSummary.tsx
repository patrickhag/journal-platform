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
} from '@/components/ui/form';
import { RichTextEditor } from '@/components/RichTextEditor';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCreateManuals, useGetManuals } from '@/hooks/useSettings';
import Loader from '@/components/Loader';
import { useEffect } from 'react';

const apcSummarySchema = z.object({
  content: z.string().min(10, 'Content must be at least 10 characters'),
});

export default function ApcSummary() {
  const { data: manualData } = useGetManuals();

  useEffect(() => {
    if (manualData?.apcSummary) {
      form.setValue('content', manualData.apcSummary.content || '');
    }
  }, [manualData]);

  const { mutate: createManualMutation, isPending } = useCreateManuals();

  const form = useForm({
    resolver: zodResolver(apcSummarySchema),
    defaultValues: {
      content: '',
    },
  });

  const onSubmit = (data: z.infer<typeof apcSummarySchema>) => {
    createManualMutation({ apcSummary: data });
  };

  return (
    <TabsContent value="apcSummary" className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Card>
            <CardHeader>
              <CardTitle>APC summary</CardTitle>
              <CardDescription>
                Add and modify the page of APC summary.
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
                        placeholder="Summarize your APC policy, fees, waivers, and billing details..."
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
