import {
  ARTICLE_STATUS,
  ARTICLE_TYPES,
  COUNTRIES,
  SALUTATION,
} from '@/lib/consts';
import { USER_ROLES } from '@/lib/roles';
import {
  boolean,
  date,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  unique,
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

// Core identity tables
export const people = pgTable('people', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  email: text('email').unique().notNull(),
  salutation: salutationEnum().$defaultFn(() => 'Mr'),
  affiliation: text('affiliation').notNull(),
  country: countryEnum().$defaultFn(() => 'Rwanda'),
  orcid: text('orcid'),
  phone: varchar('phone', { length: 20 }),
  // Flag to indicate if this person has a user account
  hasUserAccount: boolean('has_user_account').default(false),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});
//
// System users table with explicit relationship to people
export const users = pgTable('users', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  personId: text('person_id')
    .unique()  // Ensures one-to-one relationship
    .notNull()
    .references(() => people.id, { onDelete: 'cascade' }),
  role: roleEnum().$default(() => 'NORMAL_USER'),
  password: text('password').notNull(),
  emailVerified: timestamp('email_verified', { mode: 'date' }),
  avatar: text('avatar'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Authentication-related tables
export const verificationTokens = pgTable(
  'verification_tokens',
  {
    identifier: text('identifier').notNull(),
    token: text('token').notNull(),
    expires: timestamp('expires', { mode: 'date' }).notNull(),
  },
  (t) => ([
    unique().on(t.token, t.identifier)
  ])
);

export const passwordResets = pgTable(
  'password_resets',
  {
    identifier: text('identifier').notNull(),
    token: text('token').notNull(),
    password: text('password').notNull(),
    expires: timestamp('expires', { mode: 'date' }).notNull(),
  },
  (t) => ([
    unique().on(t.token, t.identifier)
  ])
);

export const authenticators = pgTable(
  'authenticators',
  {
    credentialID: text('credential_id').notNull(),
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    providerAccountId: text('provider_account_id').notNull(),
    credentialPublicKey: text('credential_public_key').notNull(),
    counter: integer('counter').notNull(),
    credentialDeviceType: text('credential_device_type').notNull(),
    credentialBackedUp: boolean('credential_backed_up').notNull(),
    transports: text('transports'),
  },
  (t) => ([
    unique().on(t.userId, t.credentialID)
  ])
);

// Article-related tables
export const articles = pgTable('articles', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  section: articleTypeEnum().$default(() => 'Articles'),
  articleStatus: articleStatusEnum().$default(() => 'Submitted'),
  submittedBy: text('submitted_by')
    .notNull()
    .references(() => people.id, { onDelete: 'cascade' }),
  createdAt: date('created_at').defaultNow(),
});

export const articleMetadata = pgTable('article_metadata', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  articleId: text('article_id')
    .notNull()
    .references(() => articles.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  prefix: text('prefix').notNull(),
  subtitle: text('subtitle').notNull(),
  abstract: text('abstract').notNull(),
  requirements: text('requirements').array(),
  commentsForEditor: text('comments_for_editor'),
});

export const articleFiles = pgTable('article_files', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  articleId: text('article_id')
    .notNull()
    .references(() => articles.id, { onDelete: 'cascade' }),
  publicId: text('public_id').notNull().unique(),
  resourceType: text('resource_type').notNull(),
  originalName: text('original_name').notNull(),
  fileType: text('file_type'),
  uploadedBy: text('uploaded_by')
    .notNull()
    .references(() => people.id, { onDelete: 'cascade' }),
});

// Article contributors relationship
export const articleContributors = pgTable('article_contributors', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  articleId: text('article_id')
    .notNull()
    .references(() => articles.id, { onDelete: 'cascade' }),
  personId: text('person_id')
    .notNull()
    .references(() => people.id, { onDelete: 'cascade' }),
  role: text('role').notNull(),
  bio: text('bio').notNull(),
  order: integer('order').notNull(),
});

// Article reviewers relationship
export const articleReviewers = pgTable('article_reviewers', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  articleId: text('article_id')
    .notNull()
    .references(() => articles.id, { onDelete: 'cascade' }),
  personId: text('person_id')
    .notNull()
    .references(() => people.id, { onDelete: 'cascade' }),
  expertise: text('expertise').notNull(),
  acceptedInvitation: boolean('accepted_invitation'),
  invitedAt: timestamp('invited_at').defaultNow(),
  respondedAt: timestamp('responded_at'),
});

export const reviews = pgTable('reviews', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  articleId: text('article_id')
    .notNull()
    .references(() => articles.id, { onDelete: 'cascade' }),
  reviewerId: text('reviewer_id')
    .notNull()
    .references(() => articleReviewers.id, { onDelete: 'cascade' }),
  message: text('message').notNull(),
  status: articleStatusEnum().$default(() => 'Minor issue'),
  createdAt: date('created_at').defaultNow(),
});

export const reviewFiles = pgTable('review_files', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  reviewId: text('review_id')
    .notNull()
    .references(() => reviews.id, { onDelete: 'cascade' }),
  fileId: text('file_id')
    .notNull()
    .references(() => articleFiles.id, { onDelete: 'cascade' }),
});

export const finalSubmissions = pgTable('final_submissions', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  articleId: text('article_id')
    .unique()
    .notNull()
    .references(() => articles.id, { onDelete: 'cascade' }),
  funded: boolean('funded').notNull(),
  ethical: boolean('ethical').notNull(),
  consent: boolean('consent').notNull(),
  human: boolean('human').notNull(),
  founders: text('founders'),
  ethicalReference: text('ethical_reference'),
});

export const notifications = pgTable('notifications', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  personId: text('person_id')
    .notNull()
    .references(() => people.id, { onDelete: 'cascade' }),
  message: text('message').notNull(),
  kind: notificationsEnum().$default(() => 'Info'),
  isRead: boolean('is_read').default(false),
  createdAt: date('created_at').defaultNow(),
});

export type TFinalSubmissions = typeof finalSubmissions.$inferInsert;
export type TArticleSubmissions = typeof articles.$inferSelect;
export type TReviewers = typeof articleReviewers.$inferInsert
export type TContributors = typeof articleContributors.$inferInsert
export type TMetadata = typeof articleMetadata.$inferInsert
export type TFiles = typeof articleFiles.$inferInsert
export type TUsers = typeof users.$inferSelect;
export type Users = typeof users.$inferInsert;
export type TNotifications = typeof notifications.$inferSelect;
