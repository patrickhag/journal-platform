CREATE TABLE "article_submissions" (
	"id" text PRIMARY KEY NOT NULL,
	"section" text NOT NULL,
	"requirements" text[] NOT NULL,
	"comments_for_editor" text,
	"articleStatus" text,
	"userId" text NOT NULL,
	"issueId" text,
	"createdAt" date DEFAULT now(),
	"updatedAt" date DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "authenticator" (
	"credentialID" text NOT NULL,
	"userId" text NOT NULL,
	"providerAccountId" text NOT NULL,
	"credentialPublicKey" text NOT NULL,
	"counter" integer NOT NULL,
	"credentialDeviceType" text NOT NULL,
	"credentialBackedUp" boolean NOT NULL,
	"transports" text,
	CONSTRAINT "authenticator_userId_credentialID_pk" PRIMARY KEY("userId","credentialID"),
	CONSTRAINT "authenticator_credentialID_unique" UNIQUE("credentialID")
);
--> statement-breakpoint
CREATE TABLE "contributor" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"salutation" text,
	"email" text NOT NULL,
	"country" text,
	"orcid" text,
	"affiliation" text NOT NULL,
	"bio" text NOT NULL,
	"role" text NOT NULL,
	"userId" text NOT NULL,
	"articleId" text
);
--> statement-breakpoint
CREATE TABLE "files" (
	"id" text PRIMARY KEY NOT NULL,
	"publicId" text NOT NULL,
	"resourceType" text NOT NULL,
	"originalName" text NOT NULL,
	"fileType" text,
	"userId" text NOT NULL,
	"articleId" text,
	CONSTRAINT "files_publicId_unique" UNIQUE("publicId")
);
--> statement-breakpoint
CREATE TABLE "final_submissions" (
	"id" text PRIMARY KEY NOT NULL,
	"funded" boolean NOT NULL,
	"ethical" boolean NOT NULL,
	"consent" boolean NOT NULL,
	"human" boolean NOT NULL,
	"founders" text,
	"ethical_reference" text,
	"articleId" text
);
--> statement-breakpoint
CREATE TABLE "issues" (
	"id" text PRIMARY KEY NOT NULL,
	"issue_number" integer NOT NULL,
	"volume_id" text NOT NULL,
	"title" text,
	"description" text,
	"publication_date" date,
	"status" text DEFAULT 'Draft',
	"created_at" date DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "metadata" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"prefix" text NOT NULL,
	"subtitle" text,
	"abstract" text NOT NULL,
	"topics" text[] DEFAULT ARRAY[]::text[] NOT NULL,
	"userId" text NOT NULL,
	"articleId" text,
	CONSTRAINT "metadata_title_unique" UNIQUE("title")
);
--> statement-breakpoint
CREATE TABLE "notifications" (
	"id" text PRIMARY KEY NOT NULL,
	"message" text NOT NULL,
	"createdAt" date DEFAULT now(),
	"kind" text,
	"isRead" boolean DEFAULT false,
	"userId" text
);
--> statement-breakpoint
CREATE TABLE "passwordResets" (
	"identifier" text NOT NULL,
	"token" text NOT NULL,
	"password" text NOT NULL,
	"expires" timestamp NOT NULL,
	CONSTRAINT "passwordResets_identifier_token_pk" PRIMARY KEY("identifier","token")
);
--> statement-breakpoint
CREATE TABLE "review_assignments" (
	"id" text PRIMARY KEY NOT NULL,
	"articleId" text,
	"reviewerId" text,
	"userId" text,
	"status" text,
	"assignedDate" date DEFAULT now(),
	"dueDate" date,
	"reviewedDate" date
);
--> statement-breakpoint
CREATE TABLE "reviewers" (
	"id" text PRIMARY KEY NOT NULL,
	"names" varchar(255) NOT NULL,
	"affiliation" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"phone" varchar(40),
	"expertise" text NOT NULL,
	"acceptedInvitation" boolean,
	"userId" text NOT NULL,
	"articleId" text
);
--> statement-breakpoint
CREATE TABLE "reviews" (
	"id" text PRIMARY KEY NOT NULL,
	"message" text NOT NULL,
	"userId" text NOT NULL,
	"articleId" text,
	"fileIds" text[] DEFAULT '{}'::text[] NOT NULL,
	"status" "article_status",
	"createdAt" date DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" text PRIMARY KEY NOT NULL,
	"firstName" text,
	"lastName" text,
	"affiliation" text,
	"country" "countries",
	"role" text DEFAULT 'NORMAL_USER',
	"email" text,
	"emailVerified" timestamp,
	"is_active" boolean DEFAULT true,
	"password" text,
	"avatar" text,
	"orcid" text,
	"createdAt" date DEFAULT now(),
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "verificationToken" (
	"identifier" text NOT NULL,
	"token" text NOT NULL,
	"expires" timestamp NOT NULL,
	CONSTRAINT "verificationToken_identifier_token_pk" PRIMARY KEY("identifier","token")
);
--> statement-breakpoint
CREATE TABLE "volumes" (
	"id" text PRIMARY KEY NOT NULL,
	"volume_number" integer NOT NULL,
	"year" integer NOT NULL,
	"title" text,
	"description" text,
	"status" text DEFAULT 'Inactive',
	"created_at" date DEFAULT now() NOT NULL,
	"updated_at" date DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "article_submissions" ADD CONSTRAINT "article_submissions_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "article_submissions" ADD CONSTRAINT "article_submissions_issueId_issues_id_fk" FOREIGN KEY ("issueId") REFERENCES "public"."issues"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "authenticator" ADD CONSTRAINT "authenticator_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "contributor" ADD CONSTRAINT "contributor_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "contributor" ADD CONSTRAINT "contributor_articleId_article_submissions_id_fk" FOREIGN KEY ("articleId") REFERENCES "public"."article_submissions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "files" ADD CONSTRAINT "files_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "files" ADD CONSTRAINT "files_articleId_article_submissions_id_fk" FOREIGN KEY ("articleId") REFERENCES "public"."article_submissions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "final_submissions" ADD CONSTRAINT "final_submissions_articleId_article_submissions_id_fk" FOREIGN KEY ("articleId") REFERENCES "public"."article_submissions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "issues" ADD CONSTRAINT "issues_volume_id_volumes_id_fk" FOREIGN KEY ("volume_id") REFERENCES "public"."volumes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "metadata" ADD CONSTRAINT "metadata_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "metadata" ADD CONSTRAINT "metadata_articleId_article_submissions_id_fk" FOREIGN KEY ("articleId") REFERENCES "public"."article_submissions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "review_assignments" ADD CONSTRAINT "review_assignments_articleId_article_submissions_id_fk" FOREIGN KEY ("articleId") REFERENCES "public"."article_submissions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "review_assignments" ADD CONSTRAINT "review_assignments_reviewerId_reviewers_id_fk" FOREIGN KEY ("reviewerId") REFERENCES "public"."reviewers"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "review_assignments" ADD CONSTRAINT "review_assignments_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reviewers" ADD CONSTRAINT "reviewers_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reviewers" ADD CONSTRAINT "reviewers_articleId_article_submissions_id_fk" FOREIGN KEY ("articleId") REFERENCES "public"."article_submissions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_articleId_article_submissions_id_fk" FOREIGN KEY ("articleId") REFERENCES "public"."article_submissions"("id") ON DELETE cascade ON UPDATE no action;