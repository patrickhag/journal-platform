CREATE TYPE "public"."article_status" AS ENUM('Draft', 'Submitted', 'In Review', 'Approved', 'Rejected', 'Published', 'Archived', 'Incomplete', 'Pending Revision', 'Under Review', 'Approved with Changes', 'Withdrawn', 'Scheduled for Publication', 'Needs More Information', 'Finalized');--> statement-breakpoint
ALTER TABLE "final_submissions" DROP CONSTRAINT "final_submissions_userId_user_id_fk";
--> statement-breakpoint
ALTER TABLE "final_submissions" ALTER COLUMN "ethical_reference" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "article_submissions" ADD COLUMN "articleStatus" "article_status";--> statement-breakpoint
ALTER TABLE "final_submissions" DROP COLUMN IF EXISTS "userId";