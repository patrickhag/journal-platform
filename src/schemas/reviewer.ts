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
  'Comments for the editor': z.string().optional(),
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
  message: z.string().min(10, {
    message: 'Review message must be at least 10 characters.',
  }),
  status: z.enum(
    ['Major Correction', 'Minor Correction', 'Accepted', 'Rejected'],
    {
      message: 'Please select a review status.',
    }
  ),
});

export const reviewAssessmentSchema = z.object({
  scopeRelevanceOriginality: z.boolean({
    required_error:
      'Please confirm the manuscript meets scope, relevance, and originality standards.',
  }),
  ethicalCompliance: z.boolean({
    required_error: 'Please confirm ethical compliance.',
  }),
  contentQualityRigor: z.boolean({
    required_error: 'Please confirm content quality and rigor.',
  }),
  dataPresentationInterpretation: z.boolean({
    required_error: 'Please confirm data presentation and interpretation.',
  }),
  conclusionsImplications: z.boolean({
    required_error: 'Please confirm conclusions and implications.',
  }),
  languageQuality: z.boolean({
    required_error: 'Please confirm language quality.',
  }),
  referencesFormatting: z.boolean({
    required_error: 'Please confirm references and formatting.',
  }),
  overallScientificQuality: z.boolean({
    required_error: 'Please confirm overall scientific quality.',
  }),
  confidentialComments: z
    .string()
    .max(2000, {
      message: 'Confidential comments cannot exceed 2000 characters.',
    })
    .optional()
    .or(z.literal('')),
  reviewerSignature: z
    .string({
      required_error: 'Reviewer signature is required.',
    })
    .min(2, { message: 'Reviewer signature must be at least 2 characters.' }),
});

export const reviewerSubmissionSchema = reviewSchema.merge(
  reviewAssessmentSchema
);

export type TArticle = {
  id: string;
  section: string;
  createdAt: string;
  userId: string;
  updatedAt: string;
  proofFileUrl: string[];
  proofStatus: string;
  articleStatus: string;
  metadata: {
    title: string;
  };
  editorActions?: {
    message: string;
    decision: string;
    editorfileId: string;
  }[];
};

export type TManuscripts = {
  userName: string;
  articles: TArticle[];
};

export type ReviewFormData = z.infer<typeof reviewerSubmissionSchema>;
