import {
  ARTICLE_STATUS,
  ARTICLE_TYPES,
  COUNTRIES,
  REVIEW_ASSIGNMENTS_STATUS,
  SALUTATION,
} from '@/lib/consts';
import { USER_ROLES } from '@/lib/roles';
import { relations, sql } from 'drizzle-orm';
import {
  boolean,
  date,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

const pool = postgres(process.env.DATABASE_URL!, { max: 1 });

export const db = drizzle(pool);
export const roleEnum = pgEnum('role', USER_ROLES);
export const articleTypeEnum = pgEnum('article-type', ARTICLE_TYPES);
export const salutationEnum = pgEnum('salutation', SALUTATION);
export const countryEnum = pgEnum('countries', COUNTRIES);
export const articleStatusEnum = pgEnum('article_status', ARTICLE_STATUS);
export const notificationsEnum = pgEnum('notication_kind', [
  'Warning',
  'Info',
  'Hint',
  'Error',
  'Confused',
  'Ok',
]);
export const reviewAssignmentsStatusEnum = pgEnum(
  'review_assignments_status',
  REVIEW_ASSIGNMENTS_STATUS
);
export const volumeStatusEnum = pgEnum('volume_status', ['Active', 'Inactive']);
export const issueStatusEnum = pgEnum('issue_status', [
  'Draft',
  'Published',
  'Archived',
]);

export const users = pgTable('user', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  firstName: text('firstName'),
  lastName: text('lastName'),
  affiliation: text('affiliation'),
  country: varchar('country', { length: 50 }),
  role: varchar('role', { length: 50 }).notNull().default('NORMAL_USER'),
  email: text('email').unique(),
  emailVerified: timestamp('emailVerified', { mode: 'date' }),
  isActive: boolean('is_active').default(true),
  password: text('password'),
  avatar: text('avatar'),
  orcid: text('orcid'),
  createdAt: date('createdAt').defaultNow(),
});

export const verificationTokens = pgTable(
  'verificationToken',
  {
    identifier: text('identifier').notNull(),
    token: text('token').notNull(),
    expires: timestamp('expires', { mode: 'date' }).notNull(),
  },
  (verificationToken) => ({
    compositePk: primaryKey({
      columns: [verificationToken.identifier, verificationToken.token],
    }),
  })
);

export const passwordResets = pgTable(
  'passwordResets',
  {
    identifier: text('identifier').notNull(),
    token: text('token').notNull(),
    password: text('password').notNull(),
    expires: timestamp('expires', { mode: 'date' }).notNull(),
  },
  (verificationToken) => ({
    compositePk: primaryKey({
      columns: [verificationToken.identifier, verificationToken.token],
    }),
  })
);

export const authenticators = pgTable(
  'authenticator',
  {
    credentialID: text('credentialID').notNull().unique(),
    userId: text('userId')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    providerAccountId: text('providerAccountId').notNull(),
    credentialPublicKey: text('credentialPublicKey').notNull(),
    counter: integer('counter').notNull(),
    credentialDeviceType: text('credentialDeviceType').notNull(),
    credentialBackedUp: boolean('credentialBackedUp').notNull(),
    transports: text('transports'),
  },
  (authenticator) => ({
    compositePK: primaryKey({
      columns: [authenticator.userId, authenticator.credentialID],
    }),
  })
);

export const files = pgTable('files', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  publicId: text('publicId').notNull(),
  resourceType: text('resourceType').notNull(),
  originalName: text('originalName').notNull(),
  fileType: text('fileType'),
  userId: text('userId')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  articleId: text('articleId').references(() => articleSubmissions.id, {
    onDelete: 'cascade',
  }),
});

export const metadata = pgTable('metadata', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  title: text('title').notNull().unique(),
  prefix: text('prefix').notNull(),
  subtitle: text('subtitle'),
  abstract: text('abstract').notNull(),
  topics: text('topics')
    .array()
    .notNull()
    .default(sql`ARRAY[]::text[]`),
  userId: text('userId')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  articleId: text('articleId').references(() => articleSubmissions.id, {
    onDelete: 'cascade',
  }),
});

export const contributors = pgTable('contributors', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text('name').notNull(),
  salutation: varchar('salutation', { length: 50 }),
  email: text('email').notNull(),
  country: varchar('country', { length: 50 }),
  orcid: text('orcid'),
  affiliation: text('affiliation').notNull(),
  bio: text('bio').notNull(),
  role: text('role').notNull(),
  userId: text('userId')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  articleId: text('articleId').references(() => articleSubmissions.id, {
    onDelete: 'cascade',
  }),
});

export const reviewers = pgTable('reviewers', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  names: varchar('names', { length: 255 }).notNull(),
  affiliation: varchar('affiliation', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  phone: varchar('phone', { length: 40 }),
  expertise: text('expertise').notNull(),
  acceptedInvitation: boolean('acceptedInvitation'),
  userId: text('userId')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  articleId: text('articleId').references(() => articleSubmissions.id, {
    onDelete: 'cascade',
  }),
});

export const reviews = pgTable('reviews', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  message: text('message').notNull(),
  userId: text('userId')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  articleId: text('articleId').references(() => articleSubmissions.id, {
    onDelete: 'cascade',
  }),
  fileIds: text('fileIds')
    .array()
    .notNull()
    .default(sql`'{}'::text[]`),
  status: varchar('status', { length: 50 }),
  createdAt: date('createdAt').defaultNow(),
});

export const articleSubmissions = pgTable('article_submissions', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  section: text('section').notNull(),
  requirements: text('requirements').array().notNull(),
  commentsForEditor: text('comments_for_editor'),
  articleStatus: varchar('article_status', { length: 50 }).default('SUBMITTED'),
  userId: text('userId')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  issueId: text('issueId').references(() => issues.id, { onDelete: 'cascade' }),
  proofFileUrl: text('proof_file_url')
    .array()
    .default(sql`'{}'::text[]`),
  proofStatus: text('proof_status'),
  proofNote: text('proof_note'),
  publishedFile: text('publishedFile'),
  doi: text('doi'),
  isEditorsPick: boolean('isEditorsPick'),
  createdAt: date('createdAt').defaultNow(),
  updatedAt: date('updatedAt').defaultNow(),
});

export const finalSubmissions = pgTable('final_submissions', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  funded: boolean('funded').notNull(),
  ethical: boolean('ethical').notNull(),
  consent: boolean('consent').notNull(),
  human: boolean('human').notNull(),
  founders: text('founders'),
  ethicalReference: text('ethical_reference'),
  articleId: text('articleId').references(() => articleSubmissions.id, {
    onDelete: 'cascade',
  }),
});

export const notifications = pgTable('notifications', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  message: text('message').notNull(),
  createdAt: date('createdAt').defaultNow(),
  kind: varchar('status', { length: 50 }),
  isRead: boolean('isRead').default(false),
  userId: text('userId').references(() => users.id, {
    onDelete: 'cascade',
  }),
});

export const reviewAssignments = pgTable('review_assignments', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  articleId: text('articleId').references(() => articleSubmissions.id, {
    onDelete: 'cascade',
  }),
  reviewerId: text('reviewerId').references(() => reviewers.id, {
    onDelete: 'cascade',
  }),
  userId: text('userId').references(() => users.id, {
    onDelete: 'cascade',
  }),
  status: varchar('review_assignments_status', { length: 50 }).default(
    'INVITED'
  ),
  assignedDate: date('assignedDate').defaultNow(),
  dueDate: date('dueDate'),
  reviewedDate: date('reviewedDate'),
});

export const volumes = pgTable('volumes', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  volumeNumber: integer('volume_number').notNull(),
  year: integer('year').notNull(),
  title: text('title'),
  description: text('description'),
  status: varchar('status', { length: 50 }).default('INACTIVE'),
  createdAt: date('created_at').defaultNow().notNull(),
  updatedAt: date('updated_at').defaultNow().notNull(),
});

export const issues = pgTable('issues', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  issueNumber: integer('issue_number').notNull(),
  volumeId: text('volume_id')
    .references(() => volumes.id, { onDelete: 'cascade' })
    .notNull(),
  title: text('title'),
  description: text('description'),
  publicationDate: date('publication_date'),
  status: varchar('status', { length: 50 }).default('DRAFT'),
  createdAt: date('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const metrics = pgTable('metrics', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  views: integer('views').default(0),
  downloads: integer('downloads').default(0),
  articleId: text('articleId')
    .references(() => articleSubmissions.id, { onDelete: 'cascade' })
    .notNull(),
  citations: integer('citations').default(0),
  createdAt: date('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const manuals = pgTable('manuals', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  guidelines: jsonb('guidelines').$type<{ content: string }>(),
  policies: jsonb('policies').$type<{
    privacyPolicy: string;
  }>(),
  instructionToAuthors: jsonb('instruction_to_authors'),
  generalSettings: jsonb('general_settings'),
  aboutUs: jsonb('aboutUs').$type<{ content: string }>(),
  aimsNscope: jsonb('aimsNscope').$type<{ content: string }>(),
  termsNconditions: jsonb('termsNconditions').$type<{ content: string }>(),
});

/*** RELATIONS ***/

export const articleSubmissionsRelations = relations(
  articleSubmissions,
  ({ one, many }) => ({
    user: one(users, {
      fields: [articleSubmissions.userId],
      references: [users.id],
    }),
    issue: one(issues, {
      fields: [articleSubmissions.issueId],
      references: [issues.id],
    }),
    metadata: one(metadata, {
      fields: [articleSubmissions.id],
      references: [metadata.articleId],
    }),
    files: many(files, {
      relationName: 'files',
    }),
    contributors: many(contributors, {
      relationName: 'contributors',
    }),
    reviewers: many(reviewers, {
      relationName: 'reviewers',
    }),
    reviewAssignments: many(reviewAssignments, {
      relationName: 'reviewAssignments',
    }),
  })
);

export const issuesRelations = relations(issues, ({ one, many }) => ({
  volume: one(volumes, {
    fields: [issues.volumeId],
    references: [volumes.id],
  }),
  articles: many(articleSubmissions),
}));

export const volumeRelations = relations(volumes, ({ many }) => ({
  issues: many(issues),
}));

export const reviewAssignmentsRelations = relations(
  reviewAssignments,
  ({ one }) => ({
    article: one(articleSubmissions, {
      fields: [reviewAssignments.articleId],
      references: [articleSubmissions.id],
    }),
    reviewer: one(reviewers, {
      fields: [reviewAssignments.reviewerId],
      references: [reviewers.id],
    }),
    user: one(users, {
      fields: [reviewAssignments.userId],
      references: [users.id],
    }),
  })
);

export const usersRelations = relations(users, ({ many }) => ({
  articles: many(articleSubmissions, {
    relationName: 'articleSubmissions',
  }),
}));

export const metadataRelations = relations(metadata, ({ one }) => ({
  article: one(articleSubmissions, {
    fields: [metadata.articleId],
    references: [articleSubmissions.id],
  }),
}));

export const filesRelations = relations(files, ({ one }) => ({
  article: one(articleSubmissions, {
    fields: [files.articleId],
    references: [articleSubmissions.id],
    relationName: 'files',
  }),
}));

export const contributorsRelations = relations(contributors, ({ one }) => ({
  article: one(articleSubmissions, {
    fields: [contributors.articleId],
    references: [articleSubmissions.id],
    relationName: 'contributors',
  }),
}));

export type TFinalSubmissions = typeof finalSubmissions.$inferInsert;
export type TArticleSubmissions = typeof articleSubmissions.$inferSelect;
export type ArticleSubmissions = typeof articleSubmissions.$inferInsert;
export type TReviewers = typeof reviewers.$inferInsert;
export type TContributors = typeof contributors.$inferInsert;
export type TMetadata = typeof metadata.$inferInsert;
export type TFiles = typeof files.$inferInsert;
export type TUsers = typeof users.$inferSelect;
export type Users = typeof users.$inferInsert;
export type TNotifications = typeof notifications.$inferSelect;
export type Notifications = typeof notifications.$inferInsert;
export type Issues = typeof issues.$inferInsert;
export type TManuals = typeof manuals.$inferInsert;
