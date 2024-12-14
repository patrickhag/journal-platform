DROP TABLE "account" CASCADE;--> statement-breakpoint
DROP TABLE "session" CASCADE;--> statement-breakpoint
ALTER TABLE "notifications" ADD COLUMN "isRead" boolean DEFAULT false;