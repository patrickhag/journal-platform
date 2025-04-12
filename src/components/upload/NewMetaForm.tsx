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
import { metadataSchema } from './ContributorsForm';
import updateArticleMeta from '@/actions/updateArticleMeta';
import { FaTimes } from 'react-icons/fa';
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
                <RichTextEditor
                  description={field.value}
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
        <label
          htmlFor="topics"
          className="mt-5 flex gap-2 items-center ring-1 ring-gray-400 has-[:focus]:ring-gray-600 rounded-sm flex-wrap p-2"
        >
          <input
            id="topics"
            placeholder="Add seo tags/topics"
            name="topic"
            ref={topicRef}
            className="outline-none px-2 border-none ring-0"
          />
          {topics.map((topic) => (
            <span
              key={topic}
              className="flex items-center gap-1 bg-blue-300 rounded-full pl-4"
            >
              {topic}{' '}
              <span
                className="bg-blue-500 p-2 rounded-full cursor-pointer text-white"
                onClick={() => {
                  setTopics(() => topics.filter((t) => t !== topic));
                }}
              >
                <FaTimes />
              </span>
            </span>
          ))}
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
