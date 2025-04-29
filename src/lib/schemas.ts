import * as z from 'zod';

export const volumeSchema = z.object({
  volumeNumber: z.number().min(1, 'Volume number must be greater than 0'),
  year: z.number().min(2000).max(2100),
  title: z.string(),
  description: z.string().optional(),
  status: z.enum(['Active', 'Inactive']),
});

export const issueSchema = z.object({
  issueNumber: z.number().min(1, 'Issue number must be greater than 0'),
  volumeId: z.string().min(1, 'Volume is required'),
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  publicationDate: z.coerce.date({
    required_error: 'Publication date is required.',
  }),
  status: z.enum(['Draft', 'Published']),
});

export type VolumeType = z.infer<typeof volumeSchema>;
export type IssueType = z.infer<typeof issueSchema>;

export type VolumeTypeExtended = VolumeType & {
  id: string;
};

export const proofSchema = z.object({
  message: z.string().min(3, 'Message is required'),
  fileIds: z.array(z.string()).optional(),
  status: z.string(),
});

export type ProofFormValues = z.infer<typeof proofSchema>;
