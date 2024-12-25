ALTER TABLE "user" ALTER COLUMN "country" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "country" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "is_active" boolean DEFAULT true;