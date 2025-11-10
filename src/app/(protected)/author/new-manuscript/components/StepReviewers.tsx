'use client';

import { useFieldArray, useFormContext } from 'react-hook-form';

import type { ManuscriptFormValues } from '../schema';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Trash2 } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';

export const StepReviewers = () => {
  const {
    control,
    register,
    formState: { errors },
  } = useFormContext<ManuscriptFormValues>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'reviewers',
  });

  const addReviewer = () => {
    append({
      names: '',
      affiliation: '',
      email: '',
      phone: '',
      expertise: '',
    });
  };

  return (
    <div className="space-y-8">
      <section className="space-y-4">
        <div>
          <h1 className="text-3xl font-bold">Reviewers</h1>
          <p className="text-sm text-muted-foreground">
            Propose reviewers for this manuscript. Provide as much detail as
            possible to help the editorial team.
          </p>
        </div>

        <div className="space-y-6">
          {fields.length === 0 && (
            <p className="text-sm text-muted-foreground">
              No reviewers added yet. Use the button below to add the first
              reviewer.
            </p>
          )}
          {fields.map((field, index) => {
            const reviewerErrors = (errors.reviewers as any)?.[index] ?? {};

            return (
              <div
                key={field.id}
                className="space-y-6 rounded-xl border border-border bg-muted/40 p-4 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold">
                      Reviewer {index + 1}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Required fields are marked with{' '}
                      <span className="text-red-500">*</span>
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="text-destructive hover:text-destructive"
                    onClick={() => remove(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Remove reviewer</span>
                  </Button>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor={`reviewers.${index}.names`}>
                      Names <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id={`reviewers.${index}.names`}
                      placeholder="Dr John Doe (Add a prefix if available)"
                      {...register(`reviewers.${index}.names` as const)}
                    />
                    {reviewerErrors?.names && (
                      <p className="text-xs text-destructive">
                        {reviewerErrors.names.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`reviewers.${index}.affiliation`}>
                      Affiliation <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id={`reviewers.${index}.affiliation`}
                      placeholder="Institution or organization"
                      {...register(`reviewers.${index}.affiliation` as const)}
                    />
                    {reviewerErrors?.affiliation && (
                      <p className="text-xs text-destructive">
                        {reviewerErrors.affiliation.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`reviewers.${index}.email`}>
                      Email <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id={`reviewers.${index}.email`}
                      type="email"
                      placeholder="email@example.com"
                      {...register(`reviewers.${index}.email` as const)}
                    />
                    {reviewerErrors?.email && (
                      <p className="text-xs text-destructive">
                        {reviewerErrors.email.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`reviewers.${index}.phone`}>
                      Phone number
                    </Label>
                    <Input
                      id={`reviewers.${index}.phone`}
                      placeholder="Optional contact number"
                      {...register(`reviewers.${index}.phone` as const)}
                    />
                    {reviewerErrors?.phone && (
                      <p className="text-xs text-destructive">
                        {reviewerErrors.phone.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`reviewers.${index}.expertise`}>
                    Expertise or relevance{' '}
                    <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    id={`reviewers.${index}.expertise`}
                    placeholder="Relevant subject areas, previous work, etc."
                    className="min-h-[120px]"
                    {...register(`reviewers.${index}.expertise` as const)}
                  />
                  {reviewerErrors?.expertise && (
                    <p className="text-xs text-destructive">
                      {reviewerErrors.expertise.message}
                    </p>
                  )}
                </div>
              </div>
            );
          })}

          <Button type="button" variant="outline" onClick={addReviewer}>
            Add reviewer
          </Button>
        </div>
      </section>
    </div>
  );
};
