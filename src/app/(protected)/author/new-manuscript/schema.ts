import { requirementsCheckboxGroup } from '@/lib/consts';
import { z } from 'zod';
import { metadataSchema } from '@/components/upload/ContributorsForm';
import { contributorFormSchema } from '@/schemas/upload';
import { reviewerSchema, finalSubmissionSchema } from '@/schemas/reviewer';

const browserFileSchema = z.custom<File>(
  (value) => (typeof File === 'undefined' ? true : value instanceof File),
  'Please upload a valid file.'
);

const fileWithTypeSchema = z.object({
  file: browserFileSchema,
  fileType: z.string().optional(),
});

export const manuscriptFormSchema = z.object({
  sectionType: z
    .string({ required_error: 'Please select a section type.' })
    .min(1, 'Please select a section type.'),
  submissionRequirements: z
    .array(z.string())
    .refine(
      (value) => value.length === requirementsCheckboxGroup.length,
      'Please acknowledge all submission requirements to continue.'
    ),
  editorComments: z.string().optional(),
  files: z
    .array(fileWithTypeSchema)
    .min(1, 'Please upload at least one file before proceeding.')
    .refine(
      (files) => files.every((file) => file.fileType && file.fileType.trim().length > 0),
      {
        message: 'Please select a file type for all uploaded files before continuing.',
      }
    ),
  metadata: metadataSchema,
  contributors: z.array(contributorFormSchema).default([]),
  reviewers: z.array(reviewerSchema).default([]),
  finalSubmission: finalSubmissionSchema,
});

export type ManuscriptFormValues = z.infer<typeof manuscriptFormSchema>;
