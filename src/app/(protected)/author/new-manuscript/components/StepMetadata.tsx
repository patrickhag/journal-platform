'use client';

import { useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import type { ManuscriptFormValues } from '../schema';
import { Input } from '@/components/ui/input';
import { RichTextEditor } from '@/components/RichTextEditor';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { ContributorsForm } from '@/components/upload/ContributorsForm';
import { SALUTATION } from '@/lib/consts';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export const StepMetadata = () => {
  const {
    control,
    register,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<ManuscriptFormValues>();

  const topics = watch('metadata.topics');
  const [topicDraft, setTopicDraft] = useState('');

  const addTopic = () => {
    if ((topics ?? []).length >= 4) return;
    const trimmed = topicDraft.trim();
    if (!trimmed) return;

    const nextTopics = Array.from(new Set([...(topics ?? []), trimmed]));
    setValue('metadata.topics', nextTopics, {
      shouldDirty: true,
      shouldValidate: true,
    });
    setTopicDraft('');
  };

  const removeTopic = (topic: string) => {
    const nextTopics = (topics ?? []).filter((item) => item !== topic);
    setValue('metadata.topics', nextTopics, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  return (
    <div className="space-y-10">
      <section className="space-y-4">
        <div>
          <h1 className="text-3xl font-bold">Metadata</h1>
          <p className="text-sm text-muted-foreground">
            Provide the core information for your manuscript. All required
            fields must be completed before continuing.
          </p>
        </div>

        <div className="space-y-6">
          <div className="grid gap-6">
            <div className="space-y-2">
              <Label htmlFor="metadata.title" className="text-sm font-medium">
                Title <span className="text-red-500">*</span>
              </Label>
              <Input
                id="metadata.title"
                placeholder="Title of the manuscript"
                {...register('metadata.title')}
              />
              {errors.metadata?.title?.message && (
                <p className="text-sm text-destructive">
                  {errors.metadata.title.message}
                </p>
              )}
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label
                  htmlFor="metadata.prefix"
                  className="text-sm font-medium"
                >
                  Prefix <span className="text-red-500">*</span>
                </Label>
                <Controller
                  control={control}
                  name="metadata.prefix"
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select prefix" />
                      </SelectTrigger>
                      <SelectContent>
                        {SALUTATION.map((value) => (
                          <SelectItem key={value} value={value}>
                            {value}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.metadata?.prefix?.message && (
                  <p className="text-sm text-destructive">
                    {errors.metadata.prefix.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="metadata.subtitle"
                  className="text-sm font-medium"
                >
                  Subtitle
                </Label>
                <Input
                  id="metadata.subtitle"
                  placeholder="Subtitle of the manuscript"
                  {...register('metadata.subtitle')}
                />
                {errors.metadata?.subtitle?.message && (
                  <p className="text-sm text-destructive">
                    {errors.metadata.subtitle.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">
              Abstract <span className="text-red-500">*</span>
            </Label>
            <p className="text-xs text-muted-foreground">
              Don't exceed 300 words
            </p>
            <Controller
              control={control}
              name="metadata.abstract"
              render={({ field }) => (
                <RichTextEditor
                  description={field.value}
                  onChange={field.onChange}
                  placeholder="Please write a brief summary of your article"
                />
              )}
            />
            {errors.metadata?.abstract?.message && (
              <p className="text-sm text-destructive">
                {String(errors.metadata.abstract.message)}
              </p>
            )}
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold">
            SEO Keywords <span className="text-red-500">*</span>
          </h2>
          <p className="text-sm text-muted-foreground">
            Add keywords to help index your manuscript. Type a keyword and press
            Enter after each one to insert it.
          </p>
        </div>
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2">
            {(topics ?? []).map((topic) => (
              <span
                key={topic}
                className="flex items-center gap-2 rounded-full bg-muted px-3 py-1 text-sm"
              >
                {topic}
                <button
                  type="button"
                  className="text-muted-foreground hover:text-destructive"
                  onClick={() => removeTopic(topic)}
                >
                  ×
                </button>
              </span>
            ))}
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <Input
              value={topicDraft}
              onChange={(event) => setTopicDraft(event.target.value)}
              placeholder="Add SEO keywords"
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  event.preventDefault();
                  addTopic();
                }
              }}
            />
            <Button type="button" variant="outline" onClick={addTopic}>
              Add keyword
            </Button>
          </div>
          {(topics ?? []).length >= 4 && (
            <p className="text-sm text-muted-foreground">
              Maximum of 4 keywords added.
            </p>
          )}
          {errors.metadata?.topics?.message && (
            <p className="text-sm text-destructive">
              {errors.metadata.topics.message}
            </p>
          )}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Contributors</h2>
        <p className="text-sm text-muted-foreground">
          Provide the contributors associated with this manuscript if any.
        </p>
        <ContributorsForm />
      </section>
    </div>
  );
};
