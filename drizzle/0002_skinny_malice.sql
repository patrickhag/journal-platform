ALTER TABLE "public"."article_submissions" ALTER COLUMN "articleStatus" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "public"."reviews" ALTER COLUMN "status" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "public"."article_status";--> statement-breakpoint
CREATE TYPE "public"."article_status" AS ENUM('Submitted', 'In Review', 'Approved', 'Rejected', 'Published', 'Archived', 'Accepted', 'Minor issue', 'Major issue');--> statement-breakpoint
ALTER TABLE "public"."article_submissions" ALTER COLUMN "articleStatus" SET DATA TYPE "public"."article_status" USING "articleStatus"::"public"."article_status";--> statement-breakpoint
ALTER TABLE "public"."reviews" ALTER COLUMN "status" SET DATA TYPE "public"."article_status" USING "status"::"public"."article_status";