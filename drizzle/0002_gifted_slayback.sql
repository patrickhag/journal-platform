CREATE TABLE "ads" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"image_url" text NOT NULL,
	"link_url" text NOT NULL,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "article_revisions" (
	"id" text PRIMARY KEY NOT NULL,
	"articleId" text,
	"fileIds" text[] DEFAULT '{}'::text[] NOT NULL,
	"submittedAt" timestamp DEFAULT now(),
	"submittedBy" text,
	"note" text
);
--> statement-breakpoint
CREATE TABLE "associate_editor_assignments" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"articleId" text NOT NULL,
	"staffEditorId" text NOT NULL,
	"status" varchar(50),
	"message" text,
	"dueDate" timestamp,
	"assignedAt" timestamp DEFAULT now(),
	"finalizedAt" timestamp
);
--> statement-breakpoint
CREATE TABLE "associateEditorCorrections" (
	"id" text PRIMARY KEY NOT NULL,
	"articleId" text,
	"fileId" text NOT NULL,
	"status" varchar(50) DEFAULT 'SUBMITTED',
	"message" text,
	"submittedAt" date DEFAULT now(),
	"approvedAt" date,
	"userId" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "author_revisions" (
	"id" text PRIMARY KEY NOT NULL,
	"articleId" text,
	"fileIds" text[] DEFAULT '{}'::text[],
	"submittedAt" timestamp DEFAULT now(),
	"authorId" text,
	"message" text
);
--> statement-breakpoint
CREATE TABLE "citations" (
	"id" text PRIMARY KEY NOT NULL,
	"metric_id" text NOT NULL,
	"bibtex_format" integer DEFAULT 0,
	"ris_format" integer DEFAULT 0,
	"apa_style" integer DEFAULT 0,
	"ama_style" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "citations_metric_id_unique" UNIQUE("metric_id")
);
--> statement-breakpoint
CREATE TABLE "collection_articles" (
	"collectionId" text NOT NULL,
	"articleId" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "collection_users" (
	"id" text PRIMARY KEY NOT NULL,
	"collectionId" text NOT NULL,
	"userId" text NOT NULL,
	"assigned_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "collections" (
	"id" text PRIMARY KEY NOT NULL,
	"title" varchar(255) NOT NULL,
	"slug" varchar(255) NOT NULL,
	"description" text,
	"objective" text,
	"sdg_goal" text,
	"is_featured" boolean DEFAULT false,
	"thumbnail_url" text,
	"status" varchar(50) DEFAULT 'ACTIVE',
	"deadline" date,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"userId" text,
	CONSTRAINT "collections_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "contacts" (
	"id" text PRIMARY KEY NOT NULL,
	"first_name" varchar(100) NOT NULL,
	"last_name" varchar(100) NOT NULL,
	"email" varchar(255) NOT NULL,
	"institution" varchar(255),
	"subject" varchar(255) NOT NULL,
	"message" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "contributors" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"salutation" varchar(50),
	"email" text NOT NULL,
	"country" varchar(50),
	"orcid" text,
	"affiliation" text NOT NULL,
	"bio" text NOT NULL,
	"role" text NOT NULL,
	"articleId" text
);
--> statement-breakpoint
CREATE TABLE "editor_actions" (
	"id" text PRIMARY KEY NOT NULL,
	"articleId" text NOT NULL,
	"editorId" text NOT NULL,
	"decision" text NOT NULL,
	"message" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "editor_assignment" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"articleId" text NOT NULL,
	"assignedAt" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "feedbacks" (
	"id" text PRIMARY KEY NOT NULL,
	"name" varchar(200),
	"email" varchar(255),
	"feedback_type" varchar(100) NOT NULL,
	"rating" varchar(5),
	"feedback_message" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "manuals" (
	"id" text PRIMARY KEY NOT NULL,
	"guidelines" jsonb,
	"policies" jsonb,
	"instruction_to_authors" jsonb,
	"general_settings" jsonb,
	"aboutUs" jsonb,
	"aimsNscope" jsonb,
	"termsNconditions" jsonb,
	"sponsors" jsonb,
	"paperTemplate" text,
	"copyrightTemplate" text,
	"humanPartsConsent" text
);
--> statement-breakpoint
CREATE TABLE "metrics" (
	"id" text PRIMARY KEY NOT NULL,
	"views" integer DEFAULT 0,
	"downloads" integer DEFAULT 0,
	"slug" text NOT NULL,
	"created_at" date DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "newsletter_subscribers" (
	"email" text PRIMARY KEY NOT NULL,
	"subscribed_at" timestamp DEFAULT NOW()
);
--> statement-breakpoint
CREATE TABLE "published_articles" (
	"id" text PRIMARY KEY NOT NULL,
	"article_id" text NOT NULL,
	"issue_id" text,
	"user_id" text,
	"slug" text,
	"doi" varchar(100),
	"status" varchar(20),
	"references" text[] DEFAULT ARRAY[]::text[] NOT NULL,
	"published_at" timestamp,
	"page_range" varchar(20),
	"pdf_url" text,
	"article_picture" text,
	"isEditorsPick" boolean,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp,
	CONSTRAINT "published_articles_article_id_unique" UNIQUE("article_id"),
	CONSTRAINT "published_articles_slug_unique" UNIQUE("slug"),
	CONSTRAINT "published_articles_doi_unique" UNIQUE("doi")
);
--> statement-breakpoint
CREATE TABLE "review_assessment" (
	"id" text PRIMARY KEY NOT NULL,
	"review_id" text NOT NULL,
	"scope_relevance_originality" boolean NOT NULL,
	"ethical_compliance" boolean NOT NULL,
	"content_quality_rigor" boolean NOT NULL,
	"data_presentation_interpretation" boolean NOT NULL,
	"conclusions_implications" boolean NOT NULL,
	"language_quality" boolean NOT NULL,
	"references_formatting" boolean NOT NULL,
	"overall_scientific_quality" boolean NOT NULL,
	"confidential_comments" text,
	"reviewer_signature" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "review_revisions" (
	"id" text PRIMARY KEY NOT NULL,
	"reviewId" text,
	"fileIds" text[] DEFAULT '{}'::text[],
	"message" text NOT NULL,
	"requestedAt" date DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "user_roles" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"role" varchar(50) NOT NULL
);
--> statement-breakpoint
ALTER TABLE "contributor" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "contributor" CASCADE;--> statement-breakpoint
ALTER TABLE "files" DROP CONSTRAINT "files_publicId_unique";--> statement-breakpoint
ALTER TABLE "article_submissions" DROP CONSTRAINT "article_submissions_issueId_issues_id_fk";
--> statement-breakpoint
ALTER TABLE "metadata" DROP CONSTRAINT "metadata_userId_user_id_fk";
--> statement-breakpoint
ALTER TABLE "reviewers" DROP CONSTRAINT "reviewers_userId_user_id_fk";
--> statement-breakpoint
ALTER TABLE "files" ALTER COLUMN "resourceType" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "files" ALTER COLUMN "originalName" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "article_submissions" ADD COLUMN "isEditorsPick" boolean;--> statement-breakpoint
ALTER TABLE "article_submissions" ADD COLUMN "acceptedAt" date;--> statement-breakpoint
ALTER TABLE "article_submissions" ADD COLUMN "paperId" text;--> statement-breakpoint
ALTER TABLE "review_assignments" ADD COLUMN "authorRevisionId" text;--> statement-breakpoint
ALTER TABLE "reviews" ADD COLUMN "reviewAssignmentId" text DEFAULT '';--> statement-breakpoint
ALTER TABLE "reviews" ADD COLUMN "reviewedAt" date DEFAULT now();--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "isPartOfEditorialBoard" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "bio" text;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "expertise" text;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "updatedAt" date;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "prefix" varchar(50);--> statement-breakpoint
ALTER TABLE "article_revisions" ADD CONSTRAINT "article_revisions_articleId_article_submissions_id_fk" FOREIGN KEY ("articleId") REFERENCES "public"."article_submissions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "article_revisions" ADD CONSTRAINT "article_revisions_submittedBy_user_id_fk" FOREIGN KEY ("submittedBy") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "associate_editor_assignments" ADD CONSTRAINT "associate_editor_assignments_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "associate_editor_assignments" ADD CONSTRAINT "associate_editor_assignments_articleId_article_submissions_id_fk" FOREIGN KEY ("articleId") REFERENCES "public"."article_submissions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "associate_editor_assignments" ADD CONSTRAINT "associate_editor_assignments_staffEditorId_user_id_fk" FOREIGN KEY ("staffEditorId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "associateEditorCorrections" ADD CONSTRAINT "associateEditorCorrections_articleId_article_submissions_id_fk" FOREIGN KEY ("articleId") REFERENCES "public"."article_submissions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "associateEditorCorrections" ADD CONSTRAINT "associateEditorCorrections_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "author_revisions" ADD CONSTRAINT "author_revisions_articleId_article_submissions_id_fk" FOREIGN KEY ("articleId") REFERENCES "public"."article_submissions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "author_revisions" ADD CONSTRAINT "author_revisions_authorId_user_id_fk" FOREIGN KEY ("authorId") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "citations" ADD CONSTRAINT "citations_metric_id_metrics_id_fk" FOREIGN KEY ("metric_id") REFERENCES "public"."metrics"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "collection_articles" ADD CONSTRAINT "collection_articles_collectionId_collections_id_fk" FOREIGN KEY ("collectionId") REFERENCES "public"."collections"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "collection_articles" ADD CONSTRAINT "collection_articles_articleId_article_submissions_id_fk" FOREIGN KEY ("articleId") REFERENCES "public"."article_submissions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "collection_users" ADD CONSTRAINT "collection_users_collectionId_collections_id_fk" FOREIGN KEY ("collectionId") REFERENCES "public"."collections"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "collection_users" ADD CONSTRAINT "collection_users_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "collections" ADD CONSTRAINT "collections_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "contributors" ADD CONSTRAINT "contributors_articleId_article_submissions_id_fk" FOREIGN KEY ("articleId") REFERENCES "public"."article_submissions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "editor_actions" ADD CONSTRAINT "editor_actions_articleId_article_submissions_id_fk" FOREIGN KEY ("articleId") REFERENCES "public"."article_submissions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "editor_actions" ADD CONSTRAINT "editor_actions_editorId_user_id_fk" FOREIGN KEY ("editorId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "editor_assignment" ADD CONSTRAINT "editor_assignment_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "editor_assignment" ADD CONSTRAINT "editor_assignment_articleId_article_submissions_id_fk" FOREIGN KEY ("articleId") REFERENCES "public"."article_submissions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "metrics" ADD CONSTRAINT "metrics_slug_published_articles_slug_fk" FOREIGN KEY ("slug") REFERENCES "public"."published_articles"("slug") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "published_articles" ADD CONSTRAINT "published_articles_article_id_article_submissions_id_fk" FOREIGN KEY ("article_id") REFERENCES "public"."article_submissions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "published_articles" ADD CONSTRAINT "published_articles_issue_id_issues_id_fk" FOREIGN KEY ("issue_id") REFERENCES "public"."issues"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "published_articles" ADD CONSTRAINT "published_articles_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "review_assessment" ADD CONSTRAINT "review_assessment_review_id_reviews_id_fk" FOREIGN KEY ("review_id") REFERENCES "public"."reviews"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "review_revisions" ADD CONSTRAINT "review_revisions_reviewId_reviews_id_fk" FOREIGN KEY ("reviewId") REFERENCES "public"."reviews"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "article_submissions" ADD CONSTRAINT "article_submissions_issueId_issues_id_fk" FOREIGN KEY ("issueId") REFERENCES "public"."issues"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "review_assignments" ADD CONSTRAINT "review_assignments_authorRevisionId_author_revisions_id_fk" FOREIGN KEY ("authorRevisionId") REFERENCES "public"."author_revisions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_reviewAssignmentId_review_assignments_id_fk" FOREIGN KEY ("reviewAssignmentId") REFERENCES "public"."review_assignments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "metadata" DROP COLUMN "userId";--> statement-breakpoint
ALTER TABLE "reviewers" DROP COLUMN "acceptedInvitation";--> statement-breakpoint
ALTER TABLE "reviewers" DROP COLUMN "userId";--> statement-breakpoint
ALTER TABLE "reviews" DROP COLUMN "createdAt";--> statement-breakpoint
ALTER TABLE "user" DROP COLUMN "role";--> statement-breakpoint
ALTER TABLE "published_articles" ALTER COLUMN "references" TYPE text[] USING "references"::text[];
