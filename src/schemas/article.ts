import { z } from "zod";
import { ARTICLE_STATUS, ARTICLE_TYPES } from '@/lib/consts';

// Create Zod enums from your existing enum values
export const articleTypeSchema = z.enum(ARTICLE_TYPES);
export const articleStatusSchema = z.enum(ARTICLE_STATUS);

// Base schema for articles
export const articleSchema = z.object({
  id: z.string().uuid(),
  section: articleTypeSchema.default('Articles'),
  articleStatus: articleStatusSchema.default('Submitted'),
  submittedBy: z.string(),
  createdAt: z.coerce.date(),
});

// Schema for creating a new article (without id and createdAt as they're auto-generated)
export const createArticleSchema = articleSchema.omit({
  id: true,
  createdAt: true
}).extend({
  section: articleTypeSchema.optional().default('Articles'),
  articleStatus: articleStatusSchema.optional().default('Submitted'),
});

// Schema for updating an article
export const updateArticleSchema = articleSchema.partial().omit({
  id: true,
  createdAt: true,
  submittedBy: true
});

// Type definitions
export type Article = z.infer<typeof articleSchema>;
export type CreateArticle = z.infer<typeof createArticleSchema>;
export type UpdateArticle = z.infer<typeof updateArticleSchema>;
