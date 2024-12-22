import { z } from "zod";
import { ARTICLE_STATUS } from '@/lib/consts';

// Create Zod enum from your existing article status enum
export const articleStatusSchema = z.enum(ARTICLE_STATUS);

// Base schema for reviews
export const reviewSchema = z.object({
  id: z.string().uuid(),
  articleId: z.string().uuid(),
  reviewerId: z.string().uuid(),
  message: z.string()
    .min(1, "Review message is required")
    .max(10000, "Review message must be less than 10000 characters"),
  status: articleStatusSchema.default('Minor issue'),
  createdAt: z.coerce.date(),
});

// Schema for creating a new review (without id and createdAt as they're auto-generated)
export const createReviewSchema = reviewSchema.omit({
  id: true,
  createdAt: true
}).extend({
  status: articleStatusSchema.optional().default('Minor issue'),
});

// Schema for updating a review
export const updateReviewSchema = reviewSchema.partial().omit({
  id: true,
  articleId: true,
  reviewerId: true,
  createdAt: true,
});

// Type definitions
export type Review = z.infer<typeof reviewSchema>;
export type CreateReview = z.infer<typeof createReviewSchema>;
export type UpdateReview = z.infer<typeof updateReviewSchema>;

// Validation error messages
export const reviewValidationMessages = {
  message: {
    required: "Review message is required",
    tooLong: "Review message must be less than 10000 characters"
  },
  status: {
    invalid: "Invalid review status"
  }
} as const;
