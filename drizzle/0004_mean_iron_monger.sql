ALTER TYPE "public"."role" ADD VALUE 'REVIEWER' BEFORE 'ADMIN';--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "country" SET DATA TYPE countries;--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "country" DROP NOT NULL;