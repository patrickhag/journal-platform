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

const policiesSchema = z.object({
  privacyPolicy: z.string(),
  editorialPolicy: z.string(),
  termsAndConditions: z.string(),
});

type PoliciesForm = z.infer<typeof policiesSchema>;

export default function Policies() {
  const form = useForm<PoliciesForm>({
    resolver: zodResolver(policiesSchema),
    defaultValues: {
      privacyPolicy: '',
      termsAndConditions: '',
      editorialPolicy: '',
    },
  });

  const { mutate: createManualMutation, isPending } = useCreateManuals();

  const { data: manualData } = useGetManuals();

  useEffect(() => {
    if (manualData?.policies) {
      form.setValue('privacyPolicy', manualData.policies.privacyPolicy || '');
      form.setValue(
        'termsAndConditions',
        manualData.policies.termsAndConditions || ''
      );
      form.setValue(
        'editorialPolicy',
        manualData.policies.editorialPolicy || ''
      );
    }
  }, [manualData]);

  const onSubmit = (data: PoliciesForm) => {
    createManualMutation({ policies: data });
  };

  return (
    <TabsContent value="policies" className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Card>
            <CardHeader>
              <CardTitle>Journal Policies</CardTitle>
              <CardDescription>
                Update privacy policy, terms and conditions, and other policies
              </CardDescription>
            </CardHeader>
            <CardContent>
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

                <FormField
                  control={form.control}
                  name="termsAndConditions"
                  render={() => (
                    <FormItem>
                      <FormLabel>Terms and Conditions</FormLabel>
                      <FormControl>
                        <RichTextEditor
                          description={form.getValues().termsAndConditions}
                          onChange={(d) => {
                            form.setValue('termsAndConditions', d);
                          }}
                          placeholder="By using this journal platform, you agree to the following terms..."
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="editorialPolicy"
                  render={() => (
                    <FormItem>
                      <FormLabel>Editorial policy</FormLabel>
                      <FormControl>
                        <RichTextEditor
                          description={form.getValues().editorialPolicy}
                          onChange={(d) => {
                            form.setValue('editorialPolicy', d);
                          }}
                          placeholder="Our editorial policy outlines how we review and publish..."
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full" disabled={isPending}>
                  {isPending ? <Loader text="Saving..." /> : 'Save Policies'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </Form>
    </TabsContent>
  );
}
