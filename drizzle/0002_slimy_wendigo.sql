ALTER TABLE "user" ADD COLUMN "firstName" text;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "lastName" text;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "affiliation" text;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "country" text;--> statement-breakpoint
ALTER TABLE "user" DROP COLUMN IF EXISTS "name";