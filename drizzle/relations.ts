import { relations } from "drizzle-orm/relations";
import { user, articleSubmissions, contributor, files, finalSubmissions, metadata, reviewers, session, authenticator, account } from "./schema";

export const articleSubmissionsRelations = relations(articleSubmissions, ({one, many}) => ({
	user: one(user, {
		fields: [articleSubmissions.userId],
		references: [user.id]
	}),
	contributors: many(contributor),
	files: many(files),
	finalSubmissions: many(finalSubmissions),
	metadata: many(metadata),
	reviewers: many(reviewers),
}));

export const userRelations = relations(user, ({many}) => ({
	articleSubmissions: many(articleSubmissions),
	contributors: many(contributor),
	files: many(files),
	finalSubmissions: many(finalSubmissions),
	metadata: many(metadata),
	reviewers: many(reviewers),
	sessions: many(session),
	authenticators: many(authenticator),
	accounts: many(account),
}));

export const contributorRelations = relations(contributor, ({one}) => ({
	user: one(user, {
		fields: [contributor.userId],
		references: [user.id]
	}),
	articleSubmission: one(articleSubmissions, {
		fields: [contributor.articleId],
		references: [articleSubmissions.id]
	}),
}));

export const filesRelations = relations(files, ({one}) => ({
	user: one(user, {
		fields: [files.userId],
		references: [user.id]
	}),
	articleSubmission: one(articleSubmissions, {
		fields: [files.articleId],
		references: [articleSubmissions.id]
	}),
}));

export const finalSubmissionsRelations = relations(finalSubmissions, ({one}) => ({
	user: one(user, {
		fields: [finalSubmissions.userId],
		references: [user.id]
	}),
	articleSubmission: one(articleSubmissions, {
		fields: [finalSubmissions.articleId],
		references: [articleSubmissions.id]
	}),
}));

export const metadataRelations = relations(metadata, ({one}) => ({
	user: one(user, {
		fields: [metadata.userId],
		references: [user.id]
	}),
	articleSubmission: one(articleSubmissions, {
		fields: [metadata.articleId],
		references: [articleSubmissions.id]
	}),
}));

export const reviewersRelations = relations(reviewers, ({one}) => ({
	user: one(user, {
		fields: [reviewers.userId],
		references: [user.id]
	}),
	articleSubmission: one(articleSubmissions, {
		fields: [reviewers.articleId],
		references: [articleSubmissions.id]
	}),
}));

export const sessionRelations = relations(session, ({one}) => ({
	user: one(user, {
		fields: [session.userId],
		references: [user.id]
	}),
}));

export const authenticatorRelations = relations(authenticator, ({one}) => ({
	user: one(user, {
		fields: [authenticator.userId],
		references: [user.id]
	}),
}));

export const accountRelations = relations(account, ({one}) => ({
	user: one(user, {
		fields: [account.userId],
		references: [user.id]
	}),
}));