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
import { filesSchema } from '@/schemas/reviewer';
import { useSearchParams } from 'next/navigation';
import { safeParse } from 'zod-urlsearchparams';
import { useClearURL } from '@/components/ClearURL';

const formSchema = z.object({
  forAuthors: z.string().min(20, 'For Authors must be at least 20 characters'),
  forReviewers: z
    .string()
    .min(20, 'For Reviewers must be at least 20 characters'),
});

export default function Guidelines() {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      forAuthors: '',
      forReviewers: '',
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
      form.setValue('forAuthors', manualData.guidelines.forAuthors || '');
      form.setValue('forReviewers', manualData.guidelines.forReviewers || '');
    }
  }, [manualData]);

  const { mutate: createManualMutation, isPending } = useCreateManuals();
  const clearUrl = useClearURL();

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    createManualMutation(
      {
        guidelines: {
          forAuthors: data.forAuthors,
          forReviewers: data.forReviewers,
        },
        paperTemplate: fileId,
      },
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
          <CardTitle>Guidelines For Some Parties</CardTitle>
          <CardDescription>
            Update the journal&apos;s guidelines for some parties
          </CardDescription>
        </CardHeader>
        {isGettingManualsPending ? (
          <Loader text="Loading manuals..." />
        ) : (
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <FormField
                  control={form.control}
                  name="forAuthors"
                  render={() => (
                    <FormItem>
                      <FormLabel>For Authors</FormLabel>
                      <FormControl>
                        <RichTextEditor
                          description={form.getValues().forAuthors}
                          onChange={(d) => {
                            form.setValue('forAuthors', d);
                          }}
                          placeholder="Authors should follow these guidelines when preparing their manuscripts..."
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="forReviewers"
                  render={() => (
                    <FormItem className="mt-4">
                      <FormLabel>For Reviewers</FormLabel>
                      <FormControl>
                        <RichTextEditor
                          description={form.getValues().forReviewers}
                          onChange={(d) => {
                            form.setValue('forReviewers', d);
                          }}
                          placeholder="Reviewers should follow these guidelines when reviewing the manuscripts..."
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
