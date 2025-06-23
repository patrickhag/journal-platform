import {
  ARTICLE_STATUS,
  ARTICLE_TYPES,
  requirementsCheckboxGroup,
} from '@/lib/consts';
import { z } from 'zod';

export const reviewerSchema = z.object({
  names: z.string().min(2, {
    message: 'Name must be at least 2 characters.',
  }),
  affiliation: z.string().min(2, {
    message: 'Affiliation must be provided.',
  }),
  email: z.string().email({
    message: 'Please enter a valid email address.',
  }),
  phone: z.string().optional(),
  expertise: z.string().min(10, {
    message: "Please provide more detail about the reviewer's expertise.",
  }),
});

export const articleSubmitionSchema = z.object({
  section: z.enum(ARTICLE_TYPES, { message: 'Please select a section' }),
  requirements: z.array(z.string()).length(requirementsCheckboxGroup.length),
  'Comments for the editor': z.string(),
  articleStatus: z
    .enum(ARTICLE_STATUS, { message: 'Please select an article status' })
    .optional(),
});

export const fileSchema = z.object({
  publicId: z.string(),
  fileType: z.string().optional(),
  bytes: z.string().optional(),
  resourceType: z.string(),
  originalName: z.string(),
});

export const filesSchema = z.object({
  files: z.array(fileSchema),
});

export const finalSubmissionSchema = z.object({
  funded: z.enum(['yes', 'no'], {
    required_error: 'Funding status is required',
  }),
  ethical: z.enum(['yes', 'no'], {
    required_error: 'Ethical clearance status is required',
  }),
  consent: z.enum(['yes', 'no'], {
    required_error: 'Informed consent status is required',
  }),
  human: z.enum(['yes', 'no'], {
    required_error: 'Human part inclusion status is required',
  }),
  founders: z.string().optional(),
  ethicalReference: z.string({ required_error: 'lorem' }).optional(),
});

export const reviewSchema = z.object({
  id: z.string().uuid().optional(),
  message: z.string().min(10, 'Message must be at least 10 characters'),
  articleId: z.string(),
  fileIds: z.array(z.string()),
  status: z.enum(['MAJOR ISSUE', 'MINOR ISSUE', 'ACCEPTED', 'REJECTED']),
});

export type TArticle = {
  section: string;
  id: string;
  createdAt: string | null;
  userId: string;
  updatedAt: string | null;
  proofFileUrl: string[] | null;
  articleStatus: string;
  metadata: {
    title: string;
  };
  editorActions: {
    message: string;
    decision: string;
    editorfileId: string | null;
  }[];
};

export type ReviewFormData = z.infer<typeof reviewSchema>;
