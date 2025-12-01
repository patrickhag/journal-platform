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

const aboutSchema = z.object({
  content: z.string().min(10, 'Content must be at least 10 characters'),
});

export default function AboutUs() {
  const { data: manualData } = useGetManuals();

  useEffect(() => {
    if (manualData?.aboutUs) {
      form.setValue('content', manualData.aboutUs.content || '');
    }
  }, [manualData]);

  const { mutate: createManualMutation, isPending } = useCreateManuals();

  const form = useForm({
    resolver: zodResolver(aboutSchema),
    defaultValues: {
      content: '',
    },
  });

  const onSubmit = (data: z.infer<typeof aboutSchema>) => {
    createManualMutation({ aboutUs: data });
  };

  return (
    <TabsContent value="aboutUs" className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Card>
            <CardHeader>
              <CardTitle>About JAEPH</CardTitle>
              <CardDescription>
                Add or modify the page on About us.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="content"
                render={() => (
                  <FormItem>
                    <FormLabel>About Content</FormLabel>
                    <FormControl>
                      <RichTextEditor
                        description={form.getValues().content}
                        onChange={(d) => {
                          form.setValue('content', d);
                        }}
                        placeholder="About us..."
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
