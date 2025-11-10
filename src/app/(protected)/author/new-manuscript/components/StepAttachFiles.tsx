'use client';

import { Controller, useFormContext } from 'react-hook-form';

import { SubmissionFileUploader } from '@/components/upload/SubmissionFileUploader';

import type { ManuscriptFormValues } from '../schema';

export const StepAttachFiles = () => {
  const {
    control,
    formState: { errors },
  } = useFormContext<ManuscriptFormValues>();

  const filesError = errors.files?.message;

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold">Upload files</h1>
        <p className="text-sm">
          Please select type for each file{' '}
          <span className="text-red-500">*</span>
        </p>
      </div>

      <Controller
        name="files"
        control={control}
        render={({ field }) => (
          <SubmissionFileUploader
            value={field.value}
            onChange={field.onChange}
            allowedFileTypes={['DOC', 'DOCX']}
            maxFiles={10}
            maxSizeMb={10}
            multiple
          />
        )}
      />

      {filesError && <p className="text-sm text-destructive">{filesError}</p>}
    </div>
  );
};
