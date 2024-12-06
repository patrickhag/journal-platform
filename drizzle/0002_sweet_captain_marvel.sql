ALTER TABLE "reviewers" ADD COLUMN "acceptedInvitation" boolean;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "avatar" text;--> statement-breakpoint
ALTER TABLE "reviewers" ADD CONSTRAINT "reviewers_email_unique" UNIQUE("email");--> statement-breakpoint
ALTER TABLE "public"."user" ALTER COLUMN "role" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "public"."role";--> statement-breakpoint
CREATE TYPE "public"."role" AS ENUM('NORMAL_USER', 'CHIEF_EDITOR', 'ADMIN');--> statement-breakpoint
ALTER TABLE "public"."user" ALTER COLUMN "role" SET DATA TYPE "public"."role" USING "role"::"public"."role";