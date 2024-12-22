import { z } from "zod";

// Base schema for article metadata
export const articleMetadataSchema = z.object({
  id: z.string().uuid(),
  articleId: z.string().uuid(),
  title: z.string()
    .min(1, "Title is required")
    .max(255, "Title must be less than 255 characters"),
  prefix: z.string()
    .min(1, "Prefix is required")
    .max(50, "Prefix must be less than 50 characters"),
  subtitle: z.string()
    .min(1, "Subtitle is required")
    .max(255, "Subtitle must be less than 255 characters"),
  abstract: z.string()
    .min(100, "Abstract must be at least 100 characters")
    .max(5000, "Abstract must be less than 5000 characters"),
  requirements: z.array(z.string())
    .default([]),
  commentsForEditor: z.string()
    .nullable()
    .optional()
    .transform(val => val || null),
});

// Schema for creating new article metadata
export const createArticleMetadataSchema = articleMetadataSchema.omit({
  id: true
});

// Schema for updating article metadata
export const updateArticleMetadataSchema = articleMetadataSchema.partial().omit({
  id: true,
  articleId: true
});

// Type definitions
export type ArticleMetadata = z.infer<typeof articleMetadataSchema>;
export type CreateArticleMetadata = z.infer<typeof createArticleMetadataSchema>;
export type UpdateArticleMetadata = z.infer<typeof updateArticleMetadataSchema>;

// Validation error messages
export const metadataValidationMessages = {
  title: {
    required: "Title is required",
    tooLong: "Title must be less than 255 characters"
  },
  prefix: {
    required: "Prefix is required",
    tooLong: "Prefix must be less than 50 characters"
  },
  subtitle: {
    required: "Subtitle is required",
    tooLong: "Subtitle must be less than 255 characters"
  },
  abstract: {
    tooShort: "Abstract must be at least 100 characters",
    tooLong: "Abstract must be less than 5000 characters"
  }
} as const;
