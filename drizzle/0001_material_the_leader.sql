ALTER TYPE "public"."article_status" ADD VALUE 'Accepted';--> statement-breakpoint
ALTER TYPE "public"."article_status" ADD VALUE 'Minor issue';--> statement-breakpoint
ALTER TYPE "public"."article_status" ADD VALUE 'Major issue';--> statement-breakpoint
ALTER TABLE "reviews" ADD COLUMN "status" "article_status";