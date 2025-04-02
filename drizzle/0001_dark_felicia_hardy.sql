CREATE TYPE "public"."issue_status" AS ENUM('Draft', 'Published', 'Archived');--> statement-breakpoint
CREATE TYPE "public"."volume_status" AS ENUM('Active', 'Inactive');--> statement-breakpoint
CREATE TABLE "issues" (
	"id" text PRIMARY KEY NOT NULL,
	"issue_number" integer NOT NULL,
	"volume_id" text NOT NULL,
	"title" text,
	"description" text,
	"publication_date" date,
	"status" "issue_status" DEFAULT 'Draft',
	"created_at" date DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "volumes" (
	"id" text PRIMARY KEY NOT NULL,
	"volume_number" integer NOT NULL,
	"year" integer NOT NULL,
	"title" text,
	"description" text,
	"status" "volume_status" DEFAULT 'Inactive',
	"created_at" date DEFAULT now() NOT NULL,
	"updated_at" date DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "article_submissions" ADD COLUMN "issueId" text;--> statement-breakpoint
ALTER TABLE "issues" ADD CONSTRAINT "issues_volume_id_volumes_id_fk" FOREIGN KEY ("volume_id") REFERENCES "public"."volumes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "article_submissions" ADD CONSTRAINT "article_submissions_issueId_issues_id_fk" FOREIGN KEY ("issueId") REFERENCES "public"."issues"("id") ON DELETE cascade ON UPDATE no action;