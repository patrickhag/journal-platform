ALTER TABLE "article_submissions" RENAME COLUMN "articleStatus" TO "article_status";--> statement-breakpoint
ALTER TABLE "review_assignments" RENAME COLUMN "status" TO "review_assignments_status";--> statement-breakpoint
ALTER TABLE "contributor" ALTER COLUMN "salutation" SET DATA TYPE varchar(50);--> statement-breakpoint
ALTER TABLE "contributor" ALTER COLUMN "country" SET DATA TYPE varchar(50);--> statement-breakpoint
ALTER TABLE "issues" ALTER COLUMN "status" SET DATA TYPE varchar(50);--> statement-breakpoint
ALTER TABLE "issues" ALTER COLUMN "status" SET DEFAULT 'DRAFT';--> statement-breakpoint
ALTER TABLE "reviews" ALTER COLUMN "status" SET DATA TYPE varchar(50);--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "country" SET DATA TYPE varchar(50);--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "role" SET DATA TYPE varchar(50);--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "role" SET DEFAULT 'NORMAL_USER';--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "role" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "volumes" ALTER COLUMN "status" SET DATA TYPE varchar(50);--> statement-breakpoint
ALTER TABLE "volumes" ALTER COLUMN "status" SET DEFAULT 'INACTIVE';--> statement-breakpoint
ALTER TABLE "notifications" ADD COLUMN "status" varchar(50);--> statement-breakpoint
ALTER TABLE "notifications" DROP COLUMN "kind";