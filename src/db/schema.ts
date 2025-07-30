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
  bio: text('bio'),
  expertise: text('expertise'),
  updatedAt: date('updatedAt'),
  prefix: varchar('prefix', { length: 50 }),
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
  resourceType: text('resourceType'),
  originalName: text('originalName'),
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
  reviewedAt: date('reviewedAt').defaultNow(),
});

export const articleSubmissions = pgTable('article_submissions', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  section: text('section').notNull(),
  requirements: text('requirements').array().notNull(),
  commentsForEditor: text('comments_for_editor'),
  articleStatus: varchar('article_status', { length: 50 }).default('SUBMITTED'),
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
  acceptedAt: date('acceptedAt'),
  userId: text('userId')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  issueId: text('issueId').references(() => issues.id),
  editorId: text('editorId').references(() => editors.id),
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
  paperTemplate: text('paperTemplate'),
  copyrightTemplate: text('copyrightTemplate'),
});

export const editorialBoardMembers = pgTable('editorial_board_members', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),

  fullName: varchar('fullname', { length: 255 }).notNull(),

  affiliation: text('affiliation').notNull(),

  country: varchar('country', { length: 100 }).notNull(),

  role: varchar('role', { length: 100 }).notNull(),

  areasOfExpertise: text('areas_of_expertise'),

  photoUrl: text('photo_url'),

  orcidOrProfileUrl: text('orcid_or_profile_url'),

  isVisible: boolean('is_visible').default(true).notNull(),

  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),

  updatedAt: timestamp('updated_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const editorActions = pgTable('editor_actions', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  articleId: text('articleId')
    .references(() => articleSubmissions.id, { onDelete: 'cascade' })
    .notNull(),
  editorId: text('editorId')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  decision: text('decision').notNull(),
  message: text('message').notNull(),
  editorfileId: text('editorfileId'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const editorActionsRelations = relations(editorActions, ({ one }) => ({
  article: one(articleSubmissions, {
    fields: [editorActions.articleId],
    references: [articleSubmissions.id],
    relationName: 'editorActions',
  }),
}));

export const articleRevisions = pgTable('article_revisions', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  articleId: text('articleId').references(() => articleSubmissions.id, {
    onDelete: 'cascade',
  }),
  fileIds: text('fileIds')
    .array()
    .notNull()
    .default(sql`'{}'::text[]`),
  submittedAt: timestamp('submittedAt').defaultNow(),
  submittedBy: text('submittedBy').references(() => users.id),
  note: text('note'),
});

export const authorRevisions = pgTable('author_revisions', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  articleId: text('articleId').references(() => articleSubmissions.id, {
    onDelete: 'cascade',
  }),
  fileIds: text('fileIds')
    .array()
    .default(sql`'{}'::text[]`),
  submittedAt: timestamp('submittedAt').defaultNow(),
  authorId: text('authorId').references(() => users.id),
  reviewerId: text('reviewerId').references(() => users.id),
  message: text('message'),
});

export const reviewRevisions = pgTable('review_revisions', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  articleId: text('articleId').references(() => articleSubmissions.id, {
    onDelete: 'cascade',
  }),
  fileIds: text('fileIds')
    .array()
    .default(sql`'{}'::text[]`),
  reviewerId: text('reviewerId').references(() => users.id),
  note: text('note'),
  reviewedAt: timestamp('reviewedAt').defaultNow(),
});

export const collections = pgTable('collections', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  title: varchar('title', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  description: text('description'),
  objective: text('objective'),
  sdgGoal: text('sdg_goal'),
  isFeatured: boolean('is_featured').default(false),
  thumbnailUrl: text('thumbnail_url'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const collectionArticles = pgTable('collection_articles', {
  collectionId: text('collectionId')
    .notNull()
    .references(() => collections.id),
  articleId: text('articleId')
    .notNull()
    .references(() => articleSubmissions.id),
});

export const collectionsRelations = relations(collections, ({ many }) => ({
  collectionArticles: many(collectionArticles, {
    relationName: 'collectionArticles',
  }),
}));

export const editors = pgTable('editors', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text('userId')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  assignedAt: timestamp('assignedAt').defaultNow(),
});

export const editorsRelations = relations(editors, ({ one, many }) => ({
  user: one(users, {
    fields: [editors.userId],
    references: [users.id],
  }),
  articleSubmissions: many(articleSubmissions, {
    relationName: 'assignedSubmissions',
  }),
}));

// export const articleSubmissionsRelations = relations(articleSubmissions, ({ one }) => ({
//   editor: one(editors, {
//     fields: [articleSubmissions.editorId],
//     references: [editors.id],
//   }),
// }));

export const collectionArticlesRelations = relations(
  collectionArticles,
  ({ one }) => ({
    collection: one(collections, {
      fields: [collectionArticles.collectionId],
      references: [collections.id],
      relationName: 'collectionArticles',
    }),
    articleSubmission: one(articleSubmissions, {
      fields: [collectionArticles.articleId],
      references: [articleSubmissions.id],
    }),
  })
);

export const publishedArticles = pgTable('published_articles', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  articleId: text('article_id')
    .notNull()
    .unique()
    .references(() => articleSubmissions.id, { onDelete: 'cascade' }),
  issueId: text('issue_id').references(() => issues.id),
  slug: text('slug').unique().notNull(),
  doi: varchar('doi', { length: 100 }).unique(),
  status: varchar('status', { length: 20 }),
  publishedAt: timestamp('published_at').defaultNow(),
  pageRange: varchar('page_range', { length: 20 }),
  pdfUrl: text('pdf_url').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at'),
});

export const publishedArticlesRelations = relations(
  publishedArticles,
  ({ one }) => ({
    article: one(articleSubmissions, {
      fields: [publishedArticles.articleId],
      references: [articleSubmissions.id],
    }),
    issue: one(issues, {
      fields: [publishedArticles.issueId],
      references: [issues.id],
    }),
  })
);

export const metrics = pgTable('metrics', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  views: integer('views').default(0),
  downloads: integer('downloads').default(0),
  articleSlug: text('slug')
    .references(() => publishedArticles.slug, { onDelete: 'cascade' })
    .notNull(),
  citations: integer('citations').default(0),
  createdAt: date('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const metricsRelations = relations(metrics, ({ one }) => ({
  publishedArticle: one(publishedArticles, {
    fields: [metrics.articleSlug],
    references: [publishedArticles.slug],
  }),
}));

/*** RELATIONS ***/

export const articleSubmissionsRelations = relations(
  articleSubmissions,
  ({ one, many }) => ({
    user: one(users, {
      fields: [articleSubmissions.userId],
      references: [users.id],
    }),
    editor: one(editors, {
      fields: [articleSubmissions.editorId],
      references: [editors.id],
      relationName: 'assignedSubmissions',
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
    reviews: many(reviews, {
      relationName: 'reviews',
    }),
    editorActions: many(editorActions, {
      relationName: 'editorActions',
    }),
    reviewAssignments: many(reviewAssignments, {
      relationName: 'reviewAssignmentsArticle',
    }),
    collectionArticles: many(collectionArticles, {
      relationName: 'collectionArticles',
    }),
    authorRevisions: many(authorRevisions, {
      relationName: 'authorRevisions',
    }),
  })
);

export const reviewersRelations = relations(reviewers, ({ one }) => ({
  article: one(articleSubmissions, {
    fields: [reviewers.articleId],
    references: [articleSubmissions.id],
    relationName: 'reviewers',
  }),
}));

export const reviewsRelations = relations(reviews, ({ one }) => ({
  article: one(articleSubmissions, {
    fields: [reviews.articleId],
    references: [articleSubmissions.id],
    relationName: 'reviews',
  }),
  user: one(users, {
    fields: [reviews.userId],
    references: [users.id],
    relationName: 'userReviews',
  }),
}));

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
      relationName: 'reviewAssignmentsArticle',
    }),
    user: one(users, {
      fields: [reviewAssignments.userId],
      references: [users.id],
      relationName: 'userReviewAssignments',
    }),
  })
);

export const usersRelations = relations(users, ({ many }) => ({
  articles: many(articleSubmissions, {
    relationName: 'articleSubmissions',
  }),
  reviews: many(reviews, {
    relationName: 'userReviews',
  }),
  reviewAssignments: many(reviewAssignments, {
    relationName: 'userReviewAssignments',
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

export const authorRevisionsRelations = relations(
  authorRevisions,
  ({ one }) => ({
    articleSubmissions: one(articleSubmissions, {
      fields: [authorRevisions.articleId],
      references: [articleSubmissions.id],
    }),
  })
);

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
export type TCollections = typeof collections.$inferSelect;
