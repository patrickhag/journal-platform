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

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { RichTextEditor } from '@/components/RichTextEditor';
import { useCreateManuals, useGetManuals } from '@/hooks/useSettings';
import Loader from '@/components/Loader';
import { useEffect } from 'react';
import { DragAndDropFileInput } from '@/components/upload/FileInput';
import { FileList } from '@/components/upload/FileList';
import { useSearchParams } from 'next/navigation';
import { safeParse } from 'zod-urlsearchparams';
import { filesSchema } from '@/schemas/reviewer';

const policiesSchema = z.object({
  privacyPolicy: z.string(),
});

type PoliciesForm = z.infer<typeof policiesSchema>;

export default function Policies() {
  const form = useForm<PoliciesForm>({
    resolver: zodResolver(policiesSchema),
    defaultValues: {
      privacyPolicy: '',
    },
  });

  const { data: manualData } = useGetManuals();
  const searchParams = useSearchParams();

  const filesValidation = safeParse({
    schema: filesSchema,
    input: new URLSearchParams(searchParams.toString()),
  });

  const files = filesValidation.data?.files || [];
  const fileIds = files.map((f) => f.publicId);
  const copyrightTemplate = fileIds[0];

  useEffect(() => {
    if (manualData?.policies) {
      form.setValue('privacyPolicy', manualData.policies.privacyPolicy || '');
    }
  }, [manualData]);

  const { mutate: createManualMutation, isPending } = useCreateManuals();

  const onSubmit = (data: PoliciesForm) => {
    createManualMutation({ policies: data, copyrightTemplate });
  };

  return (
    <TabsContent value="policies" className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Journal Policies</CardTitle>
          <CardDescription>
            Update privacy policy, terms and conditions, and other policies
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 mb-4">
            <p className="text-sm mb-4">Upload copyright template</p>
            <DragAndDropFileInput />
            <FileList isEditNeeded />
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="space-y-6">
                <FormField
                  control={form.control}
                  name="privacyPolicy"
                  render={() => (
                    <FormItem>
                      <FormLabel>Privacy Policy</FormLabel>
                      <FormControl>
                        <RichTextEditor
                          description={form.getValues().privacyPolicy}
                          placeholder="Our privacy policy outlines how we collect and use information..."
                          onChange={(d) => {
                            form.setValue('privacyPolicy', d);
                          }}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full" disabled={isPending}>
                  {isPending ? <Loader text="Saving..." /> : 'Save Policies'}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </TabsContent>
  );
}
