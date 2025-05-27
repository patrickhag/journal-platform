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

const termsAndConditionsSchema = z.object({
  content: z.string().min(10, 'Content must be at least 10 characters'),
});

export default function TermsAndConditions() {
  const { data: manualData } = useGetManuals();

  useEffect(() => {
    if (manualData?.termsNconditions) {
      form.setValue('content', manualData.termsNconditions.content || '');
    }
  }, [manualData]);

  const { mutate: createManualMutation, isPending } = useCreateManuals();

  const form = useForm({
    resolver: zodResolver(termsAndConditionsSchema),
    defaultValues: {
      content: '',
    },
  });

  const onSubmit = (data: z.infer<typeof termsAndConditionsSchema>) => {
    createManualMutation({ termsNconditions: data });
  };

  return (
    <TabsContent value="termsNconditions" className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Card>
            <CardHeader>
              <CardTitle>Terms and conditions</CardTitle>
              <CardDescription>
                Add and modify the page of Terms and conditions.
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
                        placeholder="Our terms and conditions states that..."
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
