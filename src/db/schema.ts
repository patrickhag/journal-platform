import {
  ARTICLE_STATUS,
  ARTICLE_TYPES,
  COUNTRIES,
  SALUTATION,
} from '@/lib/consts';
import { USER_ROLES } from '@/lib/roles';
import { relations, sql } from 'drizzle-orm';
import {
  boolean,
  date,
  integer,
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

export const users = pgTable('user', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  firstName: text('firstName'),
  lastName: text('lastName'),
  affiliation: text('affiliation'),
  country: countryEnum().$defaultFn(() => 'Rwanda'),
  role: roleEnum().$default(() => 'NORMAL_USER'),
  email: text('email').unique(),
  emailVerified: timestamp('emailVerified', { mode: 'date' }),
  isActive: boolean('is_active').default(true),
  password: text('password'),
  avatar: text('avatar'),
  orcid: text('orcid'),
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
  publicId: text('publicId').notNull().unique(),
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

export const contributors = pgTable('contributor', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text('name').notNull(),
  salutation: salutationEnum().$defaultFn(() => 'Mr'),
  email: text('email').notNull(),
  country: countryEnum().$defaultFn(() => 'Rwanda'),
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
  status: articleStatusEnum().$default(() => 'Minor issue'),
});

export const articleSubmissions = pgTable('article_submissions', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  section: articleTypeEnum().$default(() => 'Original Research'),
  requirements: text('requirements').array().notNull(),
  commentsForEditor: text('comments_for_editor').notNull(),
  articleStatus: articleStatusEnum().$default(() => 'Submitted'),
  userId: text('userId')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
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
  kind: notificationsEnum().$default(() => 'Info'),
  isRead: boolean('isRead').default(false),
  userId: text('userId').references(() => users.id, {
    onDelete: 'cascade',
  }),
});

/*** RELATIONS ***/

export const articleSubmissionsRelations = relations(
  articleSubmissions,
  ({ one, many }) => ({
    user: one(users, {
      fields: [articleSubmissions.userId],
      references: [users.id],
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
