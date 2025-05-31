'use client';

import { Button } from '@/components/ui/button';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { COUNTRIES, SALUTATION } from '@/lib/consts';
import { contributorFormSchema } from '@/schemas/upload';
import { zodResolver } from '@hookform/resolvers/zod';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { startTransition, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { safeParse, serialize } from 'zod-urlsearchparams';
import addNewContributor from '@/actions/addNewContributor';

export default function NewContibutorForm({
  autoSave,
}: {
  autoSave?: boolean;
}) {
  const [modalOpen, setModalOpen] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  const validation = safeParse({
    schema: z.object({
      contributors: z.array(contributorFormSchema),
    }),
    input: new URLSearchParams(searchParams.toString()),
  });

  const form = useForm<z.infer<typeof contributorFormSchema>>({
    resolver: zodResolver(contributorFormSchema),
    defaultValues: {
      name: '',
      salutation: 'Mr',
      country: 'Rwanda',
      orcid: '',
      homepage: '',
      affiliation: '',
      bio: '',
      role: 'Author',
      email: '',
    },
  });

  const { articleId } = useParams();

  const onSubmit = (data: z.infer<typeof contributorFormSchema>) => {
    if (autoSave) {
      startTransition(async () => {
        await addNewContributor({ data, articleId: articleId?.[0] });
      });
      form.reset();
      setModalOpen(false);
      return;
    }
    const contributors = validation.data?.contributors || [];
    contributors.push(data);
    const serializedData = serialize({
      data: { contributors },
      schema: z.object({
        contributors: z.array(contributorFormSchema),
      }),
    });
    const params = new URLSearchParams(searchParams.toString());

    params.delete('contributors');
    router.replace(`?${params.toString()}&${serializedData.toString()}`);
    form.reset();
    setModalOpen(false);
  };

  return (
    <div className="my-8">
      {modalOpen && (
        <>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4 my-8 py-12"
            >
              <hr />
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Names <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Full names of the contributor"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Email <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Email of the contributor"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="salutation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Salutation <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder={SALUTATION.join(', ')} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Country <span className="text-red-500">*</span>
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select country" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {COUNTRIES.map((c) => (
                          <SelectItem value={c} key={c}>
                            {c}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="space-y-4">
                <h3 className="text-lg font-medium">User details</h3>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="orcid"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>ORCID ID</FormLabel>
                        <FormControl>
                          <Input placeholder="ORCID ID" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="homepage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Homepage</FormLabel>
                        <FormControl>
                          <Input placeholder="Website page" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <FormField
                control={form.control}
                name="affiliation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Affiliation</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g: Organisation" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bio statement</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g: department, achievements, ..."
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Contributor&apos;s role{' '}
                      <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-1"
                      >
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="Author" />
                          </FormControl>
                          <FormLabel className="font-normal">Author</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="Translator" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Translator
                          </FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">Add</Button>
              </div>
            </form>
          </Form>
        </>
      )}
      {!modalOpen && (
        <Button
          onClick={() => setModalOpen(!modalOpen)}
          variant="outline"
          className="mt-4"
          type="submit"
        >
          Add contributor
        </Button>
      )}
      <p className="text-sm text-muted-foreground mt-5">
        <span className="text-red-500">*</span> Denotes a required field
      </p>
    </div>
  );
}
