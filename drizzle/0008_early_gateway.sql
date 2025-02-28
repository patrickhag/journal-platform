CREATE TYPE "public"."review_assignments_status" AS ENUM('Invited', 'Accepted', 'Declined', 'Completed');--> statement-breakpoint
CREATE TABLE "review_assignments" (
	"id" text PRIMARY KEY NOT NULL,
	"articleId" text,
	"reviewerId" text,
	"status" "review_assignments_status",
	"assignedDate" date DEFAULT now(),
	"dueDate" date,
	"reviewedDate" date,
	"reviewedBy" text
);
--> statement-breakpoint
ALTER TABLE "metadata" ALTER COLUMN "subtitle" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "contributor" ADD COLUMN "email" text NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "orcid" text;--> statement-breakpoint
ALTER TABLE "review_assignments" ADD CONSTRAINT "review_assignments_articleId_article_submissions_id_fk" FOREIGN KEY ("articleId") REFERENCES "public"."article_submissions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "review_assignments" ADD CONSTRAINT "review_assignments_reviewerId_reviewers_id_fk" FOREIGN KEY ("reviewerId") REFERENCES "public"."reviewers"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "review_assignments" ADD CONSTRAINT "review_assignments_reviewedBy_user_id_fk" FOREIGN KEY ("reviewedBy") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "public"."article_submissions" ALTER COLUMN "articleStatus" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "public"."reviews" ALTER COLUMN "status" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "public"."article_status";--> statement-breakpoint
CREATE TYPE "public"."article_status" AS ENUM('Submitted', 'Under Review', 'Approved', 'Rejected', 'Published', 'Archived', 'Accepted', 'Minor issue', 'Major issue');--> statement-breakpoint
ALTER TABLE "public"."article_submissions" ALTER COLUMN "articleStatus" SET DATA TYPE "public"."article_status" USING "articleStatus"::"public"."article_status";--> statement-breakpoint
ALTER TABLE "public"."reviews" ALTER COLUMN "status" SET DATA TYPE "public"."article_status" USING "status"::"public"."article_status";--> statement-breakpoint
ALTER TABLE "public"."article_submissions" ALTER COLUMN "section" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "public"."article-type";--> statement-breakpoint
CREATE TYPE "public"."article-type" AS ENUM('Narative Review', 'Case study', 'Case Report', 'Original Research', 'Systematic Review', 'Meta Analysis');--> statement-breakpoint
ALTER TABLE "public"."article_submissions" ALTER COLUMN "section" SET DATA TYPE "public"."article-type" USING "section"::"public"."article-type";