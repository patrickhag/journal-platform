'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  useParams,
  useRouter,
  useSearchParams,
} from 'next/navigation';
import React, {
  FC,
  PropsWithChildren,
  startTransition,
  useEffect,
  useRef,
} from 'react';
import { useForm } from 'react-hook-form';
import ReactQuill from 'react-quill-new';
import type { z } from 'zod';
import { safeParse, serialize } from 'zod-urlsearchparams';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { metadataSchema } from './ContributorsForm';
import updateArticleMeta from '@/actions/updateArticleMeta';

export const NewMetaForm: FC<
  { meta?: z.infer<typeof metadataSchema> } & PropsWithChildren
> = ({ children, meta }) => {
  const searchParams = useSearchParams();
  const parameters = useParams();
  const router = useRouter();
  const form = useRef<HTMLFormElement>(null);
  const metaValidation = safeParse({
    schema: metadataSchema,
    input: new URLSearchParams(searchParams.toString()),
  });
  const formm = useForm<z.infer<typeof metadataSchema>>({
    resolver: zodResolver(metadataSchema),
    defaultValues: metaValidation.data || {
      title: meta?.title || '',
      prefix: meta?.prefix || '',
      abstract: meta?.abstract || '',
      subtitle: meta?.subtitle || '',
    },
  });
  const currentForm = form.current;
  useEffect(() => {
    currentForm?.addEventListener('focusout', () => {
      currentForm?.requestSubmit();
    });

    return () => {
      currentForm?.removeEventListener('focusout', () => { });
    };
  }, [currentForm]);
  const saveMeta = formm.handleSubmit((data) => {
    const meta = metadataSchema.safeParse(data);
    if (meta.error) return;

    if (children) {
      startTransition(async () => {
        console.log(parameters.articleId?.[0]);
        if (!parameters.articleId) return;
        const res = await updateArticleMeta({
          meta: data,
          articleId: parameters?.articleId?.[0],
        });
        console.log(res);
        if (res === undefined) {
          return router.push(`/articles/${parameters.articleId?.[0]}`);
        }
      });
      return;
    }
    const serializedData = serialize({
      data,
      schema: metadataSchema,
    });

    const params = new URLSearchParams(searchParams.toString());
    Object.keys(data).forEach((key) => {
      params.delete(key);
    });

    router.replace(`?${params.toString()}&${serializedData.toString()}`);
    router.refresh();
    form.current?.setAttribute('submited', 'submited');
  });
  return (
    <Form {...formm}>
      <form ref={form} onSubmit={saveMeta}>
        <div className="mb-4 grid grid-cols-2 gap-4">
          <FormField
            name="prefix"
            control={formm.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="prefix">
                  Prefix <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input placeholder="Dr, Mr, Mrs..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="title"
            control={formm.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="title">
                  Title <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input placeholder="Title of the journal" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          name="subtitle"
          control={formm.control}
          render={({ field }) => (
            <FormItem className="mb-4">
              <FormLabel htmlFor="subtitle">
                Subtitle <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input placeholder="Subtitle of the journal" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="abstract"
          control={formm.control}
          render={({ field }) => (
            <FormItem className="mb-4 py-3">
              <FormLabel htmlFor="abstract">
                Abstract <span className="text-red-500">*</span>
              </FormLabel>
              <ReactQuill
                theme="snow"
                value={formm.getValues().abstract}
                onChange={(d) => {
                  formm.setValue('abstract', d);
                }}
                className="h-32 mb-4"
              />
              <FormControl>
                <Textarea
                  className="hidden"
                  placeholder="Abstract of the journal"
                  rows={4}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {children}
      </form>
    </Form>
  );
};
