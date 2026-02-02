import * as z from 'zod';
import { COUNTRIES, SALUTATION } from './consts';

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
  userId: z.string().optional(), // Keep for backward compatibility
  userIds: z
    .array(z.string())
    .min(1, 'At least one user assignment is required'),
  status: z.enum(['ACTIVE', 'ARCHIVED', 'INACTIVE']).default('ACTIVE'),
  deadline: z.coerce.date().optional(),
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

export const profileSchema = z.object({
  prefix: z.string().trim(),
  firstName: z
    .string()
    .trim()
    .min(1, 'First name is required.')
    .max(50, 'First name is too long.'),
  lastName: z
    .string()
    .trim()
    .min(1, 'Last name is required.')
    .max(50, 'Last name is too long.'),
  email: z.string().trim().email('Enter a valid email address.'),
  affiliation: z
    .string()
    .trim()
    .min(1, 'Affiliation is required.')
    .max(120, 'Affiliation is too long.'),
  country: z.string().trim(),
  orcid: z
    .string()
    .trim()
    .optional()
    .refine(
      (value) => !value || /^\d{4}-\d{4}-\d{4}-\d{4}$/.test(value),
      'Use the format 0000-0000-0000-0000.'
    ),
  bio: z
    .string()
    .trim()
    .max(1000, 'Biography should be 1000 characters or fewer.')
    .optional(),
  expertise: z
    .string()
    .trim()
    .max(250, 'Expertise should be 250 characters or fewer.')
    .optional(),
  avatar: z.string().trim().optional(),
});