'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { TabsContent } from '@/components/ui/tabs';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCreateManuals, useGetManuals } from '@/hooks/useSettings';
import Loader from '@/components/Loader';
import { useEffect } from 'react';
import { Textarea } from '@/components/ui/textarea';

const settingsSchema = z.object({
  journalName: z.string().min(1, 'Journal Name is required'),
  description: z.string().min(1, 'Description is required'),
  contactEmail: z.string().email('Invalid email address'),
  journalImpactFactor: z.string().min(1, 'Journal Impact Factor is required'),
  downloads: z.string().min(1, 'Downloads is required'),
  submissionToFirstDecision: z
    .string()
    .min(1, 'Submission to first decision is required'),
  marqueeText: z.string().optional(),
});

type SettingsForm = z.infer<typeof settingsSchema>;

export default function SiteSettings() {
  const form = useForm<SettingsForm>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      journalName: '',
      description: '',
      contactEmail: '',
      journalImpactFactor: '',
      downloads: '',
      submissionToFirstDecision: '',
      marqueeText: '',
    },
  });

  const { data: manualData } = useGetManuals();

  useEffect(() => {
    if (manualData?.generalSettings) {
      const settings = manualData.generalSettings as {
        journalName?: string;
        description?: string;
        contactEmail?: string;
        journalImpactFactor?: string;
        downloads?: string;
        submissionToFirstDecision?: string;
        marqueeText?: string;
      };
      form.setValue('journalName', settings.journalName || '');
      form.setValue('description', settings.description || '');
      form.setValue('contactEmail', settings.contactEmail || '');
      form.setValue('journalImpactFactor', settings.journalImpactFactor || '');
      form.setValue('downloads', settings.downloads || '');
      form.setValue(
        'submissionToFirstDecision',
        settings.submissionToFirstDecision || ''
      );
      form.setValue('marqueeText', settings.marqueeText || '');
    }
  }, [manualData, form]);

  const { mutate: createManualMutation, isPending } = useCreateManuals();

  const onSubmit = (data: SettingsForm) => {
    createManualMutation({
      generalSettings: {
        journalName: data.journalName,
        description: data.description,
        contactEmail: data.contactEmail,
        journalImpactFactor: data.journalImpactFactor,
        downloads: data.downloads,
        submissionToFirstDecision: data.submissionToFirstDecision,
        marqueeText: data.marqueeText,
      },
    });
  };

  return (
    <TabsContent value="settings" className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Journal Settings</CardTitle>
          <CardDescription>
            Configure general journal settings and metrics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="journalName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Journal Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Journal of Scientific Research"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        rows={4}
                        placeholder="A peer-reviewed journal publishing original research..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="contactEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="editor@journal.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="journalImpactFactor"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Journal Impact Factor</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 3.6 (2024)" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="downloads"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Downloads</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="e.g., 1234"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="submissionToFirstDecision"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Submission to First Decision</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 7 days" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="marqueeText"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Marquee Text</FormLabel>
                    <FormControl>
                      <Input placeholder="Call for Submissions..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? <Loader text="Saving..." /> : 'Save Settings'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </TabsContent>
  );
}
