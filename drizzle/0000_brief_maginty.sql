CREATE TYPE "public"."article_status" AS ENUM('Submitted', 'Under Review', 'Approved', 'Rejected', 'Published', 'Archived', 'Accepted', 'Minor issue', 'Major issue');--> statement-breakpoint
CREATE TYPE "public"."article-type" AS ENUM('Narative Review', 'Case study', 'Case Report', 'Original Research', 'Systematic Review', 'Meta Analysis');--> statement-breakpoint
CREATE TYPE "public"."countries" AS ENUM('Afghanistan', 'Albania', 'Algeria', 'Andorra', 'Angola', 'Antigua and Barbuda', 'Argentina', 'Armenia', 'Australia', 'Austria', 'Azerbaijan', 'Bahamas', 'Bahrain', 'Bangladesh', 'Barbados', 'Belarus', 'Belgium', 'Belize', 'Benin', 'Bhutan', 'Bolivia', 'Bosnia and Herzegovina', 'Botswana', 'Brazil', 'Brunei', 'Bulgaria', 'Burkina Faso', 'Burundi', 'Cabo Verde', 'Cambodia', 'Cameroon', 'Canada', 'Central African Republic', 'Chad', 'Chile', 'China', 'Colombia', 'Comoros', 'Costa Rica', 'Croatia', 'Cuba', 'Cyprus', 'Czech Republic', 'Democratic Republic of the Congo', 'Denmark', 'Djibouti', 'Dominica', 'Dominican Republic', 'East Timor', 'Ecuador', 'Egypt', 'El Salvador', 'Equatorial Guinea', 'Eritrea', 'Estonia', 'Eswatini', 'Ethiopia', 'Fiji', 'Finland', 'France', 'Gabon', 'Gambia', 'Georgia', 'Germany', 'Ghana', 'Greece', 'Grenada', 'Guatemala', 'Guinea', 'Guinea-Bissau', 'Guyana', 'Haiti', 'Honduras', 'Hungary', 'Iceland', 'India', 'Indonesia', 'Iran', 'Iraq', 'Ireland', 'Israel', 'Italy', 'Ivory Coast', 'Jamaica', 'Japan', 'Jordan', 'Kazakhstan', 'Kenya', 'Kiribati', 'Kosovo', 'Kuwait', 'Kyrgyzstan', 'Laos', 'Latvia', 'Lebanon', 'Lesotho', 'Liberia', 'Libya', 'Liechtenstein', 'Lithuania', 'Luxembourg', 'Madagascar', 'Malawi', 'Malaysia', 'Maldives', 'Mali', 'Malta', 'Marshall Islands', 'Mauritania', 'Mauritius', 'Mexico', 'Micronesia', 'Moldova', 'Monaco', 'Mongolia', 'Montenegro', 'Morocco', 'Mozambique', 'Myanmar', 'Namibia', 'Nauru', 'Nepal', 'Netherlands', 'New Zealand', 'Nicaragua', 'Niger', 'Nigeria', 'North Korea', 'North Macedonia', 'Norway', 'Oman', 'Pakistan', 'Palau', 'Panama', 'Papua New Guinea', 'Paraguay', 'Peru', 'Philippines', 'Poland', 'Portugal', 'Qatar', 'Romania', 'Russia', 'Rwanda', 'Saint Kitts and Nevis', 'Saint Lucia', 'Saint Vincent and the Grenadines', 'Samoa', 'San Marino', 'São Tomé and Príncipe', 'Saudi Arabia', 'Senegal', 'Serbia', 'Seychelles', 'Sierra Leone', 'Singapore', 'Slovakia', 'Slovenia', 'Solomon Islands', 'Somalia', 'South Africa', 'South Korea', 'South Sudan', 'Spain', 'Sri Lanka', 'Sudan', 'Suriname', 'Sweden', 'Switzerland', 'Syria', 'Taiwan', 'Tajikistan', 'Tanzania', 'Thailand', 'Togo', 'Tonga', 'Trinidad and Tobago', 'Tunisia', 'Turkey', 'Turkmenistan', 'Tuvalu', 'Uganda', 'Ukraine', 'United Arab Emirates', 'United Kingdom', 'United States', 'Uruguay', 'Uzbekistan', 'Vanuatu', 'Vatican City', 'Venezuela', 'Vietnam', 'Yemen', 'Zambia', 'Zimbabwe');--> statement-breakpoint
CREATE TYPE "public"."notication_kind" AS ENUM('Warning', 'Info', 'Hint', 'Error', 'Confused', 'Ok');--> statement-breakpoint
CREATE TYPE "public"."review_assignments_status" AS ENUM('Invited', 'Accepted', 'Declined', 'Completed');--> statement-breakpoint
CREATE TYPE "public"."role" AS ENUM('NORMAL_USER', 'CHIEF_EDITOR', 'REVIEWER', 'ADMIN');--> statement-breakpoint
CREATE TYPE "public"."salutation" AS ENUM('Mr', 'Mrs', 'Ms', 'Dr', 'Prof', 'Rev');--> statement-breakpoint
CREATE TABLE "article_submissions" (
	"id" text PRIMARY KEY NOT NULL,
	"section" text NOT NULL,
	"requirements" text[] NOT NULL,
	"comments_for_editor" text NOT NULL,
	"articleStatus" "article_status",
	"userId" text NOT NULL,
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
	"salutation" "salutation",
	"email" text NOT NULL,
	"country" "countries",
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
	"kind" "notication_kind",
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
	"status" "review_assignments_status",
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
	"status" "article_status"
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" text PRIMARY KEY NOT NULL,
	"firstName" text,
	"lastName" text,
	"affiliation" text,
	"country" "countries",
	"role" "role",
	"email" text,
	"emailVerified" timestamp,
	"is_active" boolean DEFAULT true,
	"password" text,
	"avatar" text,
	"orcid" text,
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
ALTER TABLE "article_submissions" ADD CONSTRAINT "article_submissions_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "authenticator" ADD CONSTRAINT "authenticator_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "contributor" ADD CONSTRAINT "contributor_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "contributor" ADD CONSTRAINT "contributor_articleId_article_submissions_id_fk" FOREIGN KEY ("articleId") REFERENCES "public"."article_submissions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "files" ADD CONSTRAINT "files_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "files" ADD CONSTRAINT "files_articleId_article_submissions_id_fk" FOREIGN KEY ("articleId") REFERENCES "public"."article_submissions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "final_submissions" ADD CONSTRAINT "final_submissions_articleId_article_submissions_id_fk" FOREIGN KEY ("articleId") REFERENCES "public"."article_submissions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
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