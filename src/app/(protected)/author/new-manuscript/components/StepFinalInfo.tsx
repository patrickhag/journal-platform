'use client';

import { useFormContext, Controller } from 'react-hook-form';

import type { ManuscriptFormValues } from '../schema';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

const RequiredLabel = ({ children }: { children: React.ReactNode }) => (
  <span>
    {children} <span className="text-red-500">*</span>
  </span>
);

export const StepFinalInfo = () => {
  const {
    control,
    register,
    watch,
    formState: { errors },
  } = useFormContext<ManuscriptFormValues>();

  const submission = watch('finalSubmission') ?? {};
  const finalErrors = (errors.finalSubmission ?? {}) as Record<string, any>;

  return (
    <div className="space-y-8">
      <section className="space-y-4">
        <div>
          <h1 className="text-3xl font-bold">Additional information</h1>
          <p className="text-sm text-muted-foreground">
            Provide final details about funding, ethics, and human-participant
            involvement for this manuscript.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-3">
            <Label>
              <RequiredLabel>Was this study funded?</RequiredLabel>
            </Label>
            <Controller
              control={control}
              name="finalSubmission.funded"
              render={({ field }) => (
                <RadioGroup
                  className="flex gap-4"
                  value={field.value ?? ''}
                  onValueChange={field.onChange}
                >
                  <label
                    htmlFor="funded-yes"
                    className={cn(
                      'flex items-center gap-2 rounded border border-border px-3 py-2 text-sm',
                      field.value === 'yes' && 'border-indigo-500 bg-indigo-50'
                    )}
                  >
                    <RadioGroupItem id="funded-yes" value="yes" />
                    Yes
                  </label>
                  <label
                    htmlFor="funded-no"
                    className={cn(
                      'flex items-center gap-2 rounded border border-border px-3 py-2 text-sm',
                      field.value === 'no' && 'border-indigo-500 bg-indigo-50'
                    )}
                  >
                    <RadioGroupItem id="funded-no" value="no" />
                    No
                  </label>
                </RadioGroup>
              )}
            />
            {errors.finalSubmission?.funded && (
              <p className="text-xs text-destructive">
                {finalErrors.funded?.message}
              </p>
            )}
            {submission?.funded === 'yes' && (
              <div className="space-y-2">
                <Label htmlFor="finalSubmission-founders">
                  Funding organization <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="finalSubmission-founders"
                  placeholder="Name of the funding organization"
                  {...register('finalSubmission.founders')}
                />
                {finalErrors.founders && (
                  <p className="text-xs text-destructive">
                    {finalErrors.founders.message}
                  </p>
                )}
              </div>
            )}
          </div>

          <div className="space-y-3">
            <Label>
              <RequiredLabel>
                Was this study given an ethical clearance?
              </RequiredLabel>
            </Label>
            <Controller
              control={control}
              name="finalSubmission.ethical"
              render={({ field }) => (
                <RadioGroup
                  className="flex gap-4"
                  value={field.value ?? ''}
                  onValueChange={field.onChange}
                >
                  <label
                    htmlFor="ethical-yes"
                    className={cn(
                      'flex items-center gap-2 rounded border border-border px-3 py-2 text-sm',
                      field.value === 'yes' && 'border-indigo-500 bg-indigo-50'
                    )}
                  >
                    <RadioGroupItem id="ethical-yes" value="yes" />
                    Yes
                  </label>
                  <label
                    htmlFor="ethical-no"
                    className={cn(
                      'flex items-center gap-2 rounded border border-border px-3 py-2 text-sm',
                      field.value === 'no' && 'border-indigo-500 bg-indigo-50'
                    )}
                  >
                    <RadioGroupItem id="ethical-no" value="no" />
                    No
                  </label>
                </RadioGroup>
              )}
            />
            {finalErrors.ethical && (
              <p className="text-xs text-destructive">
                {finalErrors.ethical.message}
              </p>
            )}
            {submission?.ethical === 'yes' && (
              <div className="space-y-2">
                <Label htmlFor="finalSubmission-ethicalReference">
                  Ethical reference number{' '}
                  <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="finalSubmission-ethicalReference"
                  placeholder="Reference number"
                  {...register('finalSubmission.ethicalReference')}
                />
                {finalErrors.ethicalReference && (
                  <p className="text-xs text-destructive">
                    {finalErrors.ethicalReference.message}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-3">
            <Label>
              <RequiredLabel>
                Has this study provided informed consent?
              </RequiredLabel>
            </Label>
            <Controller
              control={control}
              name="finalSubmission.consent"
              render={({ field }) => (
                <RadioGroup
                  className="flex gap-4"
                  value={field.value ?? ''}
                  onValueChange={field.onChange}
                >
                  <label
                    htmlFor="consent-yes"
                    className={cn(
                      'flex items-center gap-2 rounded border border-border px-3 py-2 text-sm',
                      field.value === 'yes' && 'border-indigo-500 bg-indigo-50'
                    )}
                  >
                    <RadioGroupItem id="consent-yes" value="yes" />
                    Yes
                  </label>
                  <label
                    htmlFor="consent-no"
                    className={cn(
                      'flex items-center gap-2 rounded border border-border px-3 py-2 text-sm',
                      field.value === 'no' && 'border-indigo-500 bg-indigo-50'
                    )}
                  >
                    <RadioGroupItem id="consent-no" value="no" />
                    No
                  </label>
                </RadioGroup>
              )}
            />
            {finalErrors.consent && (
              <p className="text-xs text-destructive">
                {finalErrors.consent.message}
              </p>
            )}
          </div>

          <div className="space-y-3">
            <Label>
              <RequiredLabel>
                Has this study included human parts such as blood samples or
                tissues?
              </RequiredLabel>
            </Label>
            <Controller
              control={control}
              name="finalSubmission.human"
              render={({ field }) => (
                <RadioGroup
                  className="flex gap-4"
                  value={field.value ?? ''}
                  onValueChange={field.onChange}
                >
                  <label
                    htmlFor="human-yes"
                    className={cn(
                      'flex items-center gap-2 rounded border border-border px-3 py-2 text-sm',
                      field.value === 'yes' && 'border-indigo-500 bg-indigo-50'
                    )}
                  >
                    <RadioGroupItem id="human-yes" value="yes" />
                    Yes
                  </label>
                  <label
                    htmlFor="human-no"
                    className={cn(
                      'flex items-center gap-2 rounded border border-border px-3 py-2 text-sm',
                      field.value === 'no' && 'border-indigo-500 bg-indigo-50'
                    )}
                  >
                    <RadioGroupItem id="human-no" value="no" />
                    No
                  </label>
                </RadioGroup>
              )}
            />
            {finalErrors.human && (
              <p className="text-xs text-destructive">
                {finalErrors.human.message}
              </p>
            )}
            {submission?.human === 'yes' && (
              <div className="mt-3 rounded-lg border border-amber-200 bg-amber-50 p-3">
                <p className="text-sm text-amber-800">
                  <strong>Notice:</strong> Required Human Research participant
                  checklist(for human blood samples or tissues, biological
                  material) must be filled and uploaded in step 2. see it on
                  homepage downloads.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};
