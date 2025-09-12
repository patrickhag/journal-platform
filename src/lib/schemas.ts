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

export const decisionSchema = z.object({
  action: z.enum(['ACCEPT', 'REJECT', 'REVISION']),
  message: z
    .string()
    .min(20, 'Decision message must be at least 20 characters'),
});

export type DecisionFormData = z.infer<typeof decisionSchema>;

export const reReviewSchema = z.object({
  message: z.string().min(20, 'Message must be at least 20 characters'),
});

export type ReReviewFormData = z.infer<typeof reReviewSchema>;

export const collectionSchema = z.object({
  title: z.string().min(2, 'Title is required'),
  description: z.string().min(5, 'Description is required'),
  objective: z.string().optional(),
  sdgGoal: z.string().min(1, 'SDG Goal is required'),
  isFeatured: z.boolean().optional(),
  thumbnailUrl: z
    .string()
    .url('Must be a valid URL')
    .min(1, 'Thumbnail is required'),
});

export type CollectionFormValues = z.infer<typeof collectionSchema>;

export const publishArticleSchema = z.object({
  issueId: z.string().min(1, 'Issue is required'),
  doi: z.string().optional(),
  pageRange: z.string().optional(),
  files: z
    .array(z.string().url({ message: 'Invalid URL format' }))
    .min(1, 'At least one PDF URL is required'),
});

export const adSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  linkUrl: z.string().url('Must be a valid link'),
  startDate: z.date({ required_error: 'Start date is required' }),
  endDate: z.date({ required_error: 'End date is required' }),
  isActive: z.boolean(),
});

export type AdFormSchema = z.infer<typeof adSchema>;

export const inviteSchema = z.object({
  message: z
    .string()
    .min(1, { message: 'Invitation message is required.' })
    .max(2000, { message: 'Message should not exceed 2000 characters.' }),
});

export type InviteFormData = z.infer<typeof inviteSchema>;
