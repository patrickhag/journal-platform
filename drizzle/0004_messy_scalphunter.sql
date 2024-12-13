CREATE TYPE "public"."notication_kind" AS ENUM('Warning', 'Info', 'Hint', 'Error', 'Confused', 'Ok');--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "notifications" (
	"id" text PRIMARY KEY NOT NULL,
	"message" text NOT NULL,
	"createdAt" date DEFAULT now(),
	"kind" "notication_kind",
	"userId" text
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "notifications" ADD CONSTRAINT "notifications_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
