'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import React, {
  FC,
  PropsWithChildren,
  startTransition,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useForm } from 'react-hook-form';
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
import { metadataSchema } from './ContributorsForm';
import updateArticleMeta from '@/actions/updateArticleMeta';
import { RichTextEditor } from '../RichTextEditor';

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
      topics: meta?.topics || [],
    },
  });
  const currentForm = form.current;

  const [topics, setTopics] = useState<string[]>(
    metaValidation.data?.topics || []
  );

  useEffect(() => {
    currentForm?.addEventListener('focusout', () => {
      currentForm?.requestSubmit();
    });
    return () => {
      currentForm?.removeEventListener('focusout', () => {});
    };
  }, [currentForm]);

  const saveMeta = formm.handleSubmit((data) => {
    const meta = metadataSchema.safeParse(data);

    if (meta.error) return;

    if (children) {
      startTransition(async () => {
        if (!parameters.articleId) return;
        const res = await updateArticleMeta({
          meta: data,
          articleId: parameters?.articleId?.[0],
        });
        if (res === undefined) {
          return router.push(`/articles/${parameters.articleId?.[0]}`);
        }
      });
      return;
    }

    const serializedData = serialize({
      data: { ...meta.data, topics },
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

  const topicRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    currentForm?.requestSubmit();
  }, [topics, setTopics]);

  return (
    <>
      <Form {...formm}>
        <form ref={form} onSubmit={saveMeta}>
          <FormField
            name="title"
            control={formm.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="title">
                  Title <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input placeholder="Title of the manuscript" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="mb-4 grid grid-cols-2 gap-4 mt-3">
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
              name="subtitle"
              control={formm.control}
              render={({ field }) => (
                <FormItem className="mb-4">
                  <FormLabel htmlFor="subtitle">Subtitle</FormLabel>
                  <FormControl>
                    <Input placeholder="Subtitle of the journal" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            name="abstract"
            control={formm.control}
            render={({ field }) => (
              <FormItem className="mb-4">
                <FormLabel htmlFor="abstract">
                  Abstract <span className="text-red-500">*</span>
                </FormLabel>
                <RichTextEditor
                  description={field.value}
                  placeholder="Please write a brief summary of your article"
                  onChange={(d) => {
                    formm.setValue('abstract', d);
                  }}
                />
                <FormMessage />
              </FormItem>
            )}
          />
          {children}
        </form>
      </Form>
      <form
        action={(e) => {
          const topic = e.get('topic')?.toString();
          if (!topic) return;
          setTopics((prevTopics) => [...new Set([...prevTopics, topic])]);
        }}
      >
        <div>
          SEO Keywords <span className="text-red-500">*</span>
        </div>
        <label
          htmlFor="topics"
          className="mt-5 flex flex-wrap items-center gap-2 border border-gray-300 rounded-md px-3 py-2"
        >
          {topics.map((topic) => (
            <span
              key={topic}
              className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full"
            >
              {topic}
              <button
                type="button"
                className="text-gray-500 hover:text-black text-sm"
                onClick={() => {
                  setTopics((prev) => prev.filter((t) => t !== topic));
                }}
              >
                ×
              </button>
            </span>
          ))}

          <input
            id="topics"
            placeholder="Add seo keywords"
            name="topic"
            ref={topicRef}
            className="outline-none border-none placeholder-gray-400 text-sm"
          />
        </label>

        <button
          onFocus={(e) => {
            e.currentTarget.closest('form')?.requestSubmit();
            topicRef.current?.focus();
          }}
          className="opacity-0"
        >
          sseend
        </button>
      </form>
    </>
  );
};
