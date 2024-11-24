import {
  boolean,
  timestamp,
  pgTable,
  text,
  primaryKey,
  integer,
  pgEnum,
  varchar,
} from "drizzle-orm/pg-core"
import postgres from "postgres"
import { drizzle } from "drizzle-orm/postgres-js"
import type { AdapterAccountType } from "next-auth/adapters"
import { ARTICLE_TYPES, COUNTRIES, SALUTATION } from "@/lib/consts"

const pool = postgres(process.env.DATABASE_URL!, { max: 1 })

export const db = drizzle(pool)
export const roleEnum = pgEnum("role", ['NORMAL_USER', 'EDITOR', 'REVIEWER'])
export const articleTypeEnum = pgEnum("artticle-type", ARTICLE_TYPES)
export const salutationEnum = pgEnum("salutation", SALUTATION)
export const countryEnum = pgEnum("countries", COUNTRIES)

export const users = pgTable("user", {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  firstName: text('firstName'),
  lastName: text('lastName'),
  affiliation: text('affiliation'),
  country: countryEnum().$defaultFn(() => "Rwanda"),
  role: roleEnum().$default(() => 'NORMAL_USER'),
  email: text('email').unique(),
  emailVerified: timestamp('emailVerified', { mode: 'date' }),
  password: text('password'),
})

export const accounts = pgTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccountType>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  })
)

export const sessions = pgTable("session", {
  sessionToken: text("sessionToken").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
})

export const verificationTokens = pgTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (verificationToken) => ({
    compositePk: primaryKey({
      columns: [verificationToken.identifier, verificationToken.token],
    }),
  })
)
export const passwordResets = pgTable(
  "passwordResets",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    password: text("password").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (verificationToken) => ({
    compositePk: primaryKey({
      columns: [verificationToken.identifier, verificationToken.token],
    }),
  })
)

export const authenticators = pgTable(
  "authenticator",
  {
    credentialID: text("credentialID").notNull().unique(),
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    providerAccountId: text("providerAccountId").notNull(),
    credentialPublicKey: text("credentialPublicKey").notNull(),
    counter: integer("counter").notNull(),
    credentialDeviceType: text("credentialDeviceType").notNull(),
    credentialBackedUp: boolean("credentialBackedUp").notNull(),
    transports: text("transports"),
  },
  (authenticator) => ({
    compositePK: primaryKey({
      columns: [authenticator.userId, authenticator.credentialID],
    }),
  })
)

export const files = pgTable(
  "files",
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    publicId: text("publicId").notNull().unique(),
    resourceType: text("resourceType").notNull(),
    originalName: text("originalName").notNull(),
    fileType: text("fileType"),
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    articleId: text("articleId")
      .references(() => articleSubmissions.id, { onDelete: "cascade" }),
  }
)

export const metadata = pgTable(
  "metadata",
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    title: text("title").notNull().unique(),
    prefix: text("prefix").notNull(),
    subtitle: text("subtitle").notNull(),
    abstract: text("abstract").notNull(),
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    articleId: text("articleId")
      .references(() => articleSubmissions.id, { onDelete: "cascade" }),
  }
)

export const contributors = pgTable(
  "contributor",
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    name: text("name").notNull(),
    salutation: salutationEnum().$defaultFn(() => "Mr"),
    country: countryEnum().$defaultFn(() => 'Rwanda'),
    homepage: text("homepage"),
    orcid: text("orcid"),
    affiliation: text("affiliation").notNull(),
    bio: text("bio").notNull(),
    role: text("role").notNull(),
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    articleId: text("articleId")
      .references(() => articleSubmissions.id, { onDelete: "cascade" }),
  }
)

export const reviewers = pgTable("reviewers", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  names: varchar("names", { length: 255 }).notNull(),
  affiliation: varchar("affiliation", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 20 }),
  expertise: text("expertise").notNull(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  articleId: text("articleId")
    .references(() => articleSubmissions.id, { onDelete: "cascade" }),
});

export const articleSubmissions = pgTable("article_submissions", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  section: articleTypeEnum().$default(() => 'Articles'),
  requirements: text("requirements").array().notNull(),
  commentsForEditor: text("comments_for_editor").notNull(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
});

export const finalSubmissions = pgTable('final_submissions', {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  funded: boolean('funded').notNull(),
  ethical: boolean('ethical').notNull(),
  consent: boolean('consent').notNull(),
  human: boolean('human').notNull(),
  founders: text('founders'),
  ethicalReference: varchar('ethical_reference', { length: 255 }),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  articleId: text("articleId")
    .references(() => articleSubmissions.id, { onDelete: "cascade" }),
});

export type TFinalSubmissions = typeof finalSubmissions.$inferInsert
export type TArticleSubmissions = typeof articleSubmissions.$inferInsert
export type TReviewers = typeof reviewers.$inferInsert
export type TContributors = typeof contributors.$inferInsert
export type TMetadata = typeof metadata.$inferInsert
export type TFiles = typeof files.$inferInsert