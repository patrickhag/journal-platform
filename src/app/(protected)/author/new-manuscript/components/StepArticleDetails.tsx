'use client';

import { ARTICLE_TYPES, requirementsCheckboxGroup } from '@/lib/consts';
import { RichTextEditor } from '@/components/RichTextEditor';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Controller, useFormContext } from 'react-hook-form';
import type { ManuscriptFormValues } from '../schema';

export const StepArticleDetails = () => {
  const {
    control,
    formState: { errors },
  } = useFormContext<ManuscriptFormValues>();

  const submissionRequirementsError = errors.submissionRequirements?.message;

  return (
    <div className="space-y-10">
      <section className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold">Article type</h2>
          <p className="text-sm text-muted-foreground">
            Select the section that best fits your submission.
          </p>
        </div>
        <div className="space-y-2">
          <Label className="text-sm font-medium">
            Section type <span className="text-red-500">*</span>
          </Label>
          <Controller
            name="sectionType"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select section type" />
                </SelectTrigger>
                <SelectContent>
                  {ARTICLE_TYPES.map((article) => (
                    <SelectItem key={article} value={article}>
                      {article}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.sectionType?.message && (
            <p className="text-sm text-destructive">
              {errors.sectionType.message}
            </p>
          )}
        </div>
      </section>

      <section className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold">
            Submission requirements <span className="text-red-500">*</span>
          </h2>
          <p className="text-sm text-muted-foreground">
            You must read and acknowledge the requirements below before
            proceeding.
          </p>
        </div>
        <Controller
          name="submissionRequirements"
          control={control}
          render={({ field }) => (
            <div className="space-y-4">
              {requirementsCheckboxGroup.map(({ id, text }) => {
                const isChecked = field.value?.includes(id) ?? false;

                return (
                  <div key={id} className="flex items-start space-x-3">
                    <Checkbox
                      id={id}
                      checked={isChecked}
                      onCheckedChange={(checked) => {
                        const current = field.value ?? [];
                        const shouldCheck = checked === true;

                        if (shouldCheck) {
                          field.onChange(Array.from(new Set([...current, id])));
                        } else {
                          field.onChange(current.filter((v) => v !== id));
                        }
                      }}
                    />
                    <Label htmlFor={id} className="text-sm leading-6">
                      {text}
                    </Label>
                  </div>
                );
              })}
            </div>
          )}
        />
        {submissionRequirementsError && (
          <p className="text-sm text-destructive">
            {submissionRequirementsError}
          </p>
        )}
      </section>

      <section className="space-y-3">
        <h2 className="text-2xl font-semibold">Comments for the editors</h2>
        <Controller
          name="editorComments"
          control={control}
          render={({ field }) => (
            <RichTextEditor
              description={field.value}
              onChange={field.onChange}
              placeholder="Add any specific comments or notes for the editor here..."
            />
          )}
        />
      </section>
    </div>
  );
};
