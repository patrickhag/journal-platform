import { pgTable, unique, text, timestamp, foreignKey, date, boolean, varchar, primaryKey, integer, pgEnum } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"

export const artticleType = pgEnum("artticle-type", ['Articles', 'Editorial Information', 'Editorial', 'Original Research', 'Review Articles', 'Short reports', 'Commentaries', 'Letters to the editor'])
export const countries = pgEnum("countries", ['Afghanistan', 'Albania', 'Algeria', 'Andorra', 'Angola', 'Antigua and Barbuda', 'Argentina', 'Armenia', 'Australia', 'Austria', 'Azerbaijan', 'Bahamas', 'Bahrain', 'Bangladesh', 'Barbados', 'Belarus', 'Belgium', 'Belize', 'Benin', 'Bhutan', 'Bolivia', 'Bosnia and Herzegovina', 'Botswana', 'Brazil', 'Brunei', 'Bulgaria', 'Burkina Faso', 'Burundi', 'Cabo Verde', 'Cambodia', 'Cameroon', 'Canada', 'Central African Republic', 'Chad', 'Chile', 'China', 'Colombia', 'Comoros', 'Costa Rica', 'Croatia', 'Cuba', 'Cyprus', 'Czech Republic', 'Democratic Republic of the Congo', 'Denmark', 'Djibouti', 'Dominica', 'Dominican Republic', 'East Timor', 'Ecuador', 'Egypt', 'El Salvador', 'Equatorial Guinea', 'Eritrea', 'Estonia', 'Eswatini', 'Ethiopia', 'Fiji', 'Finland', 'France', 'Gabon', 'Gambia', 'Georgia', 'Germany', 'Ghana', 'Greece', 'Grenada', 'Guatemala', 'Guinea', 'Guinea-Bissau', 'Guyana', 'Haiti', 'Honduras', 'Hungary', 'Iceland', 'India', 'Indonesia', 'Iran', 'Iraq', 'Ireland', 'Israel', 'Italy', 'Ivory Coast', 'Jamaica', 'Japan', 'Jordan', 'Kazakhstan', 'Kenya', 'Kiribati', 'Kosovo', 'Kuwait', 'Kyrgyzstan', 'Laos', 'Latvia', 'Lebanon', 'Lesotho', 'Liberia', 'Libya', 'Liechtenstein', 'Lithuania', 'Luxembourg', 'Madagascar', 'Malawi', 'Malaysia', 'Maldives', 'Mali', 'Malta', 'Marshall Islands', 'Mauritania', 'Mauritius', 'Mexico', 'Micronesia', 'Moldova', 'Monaco', 'Mongolia', 'Montenegro', 'Morocco', 'Mozambique', 'Myanmar', 'Namibia', 'Nauru', 'Nepal', 'Netherlands', 'New Zealand', 'Nicaragua', 'Niger', 'Nigeria', 'North Korea', 'North Macedonia', 'Norway', 'Oman', 'Pakistan', 'Palau', 'Panama', 'Papua New Guinea', 'Paraguay', 'Peru', 'Philippines', 'Poland', 'Portugal', 'Qatar', 'Romania', 'Russia', 'Rwanda', 'Saint Kitts and Nevis', 'Saint Lucia', 'Saint Vincent and the Grenadines', 'Samoa', 'San Marino', 'São Tomé and Príncipe', 'Saudi Arabia', 'Senegal', 'Serbia', 'Seychelles', 'Sierra Leone', 'Singapore', 'Slovakia', 'Slovenia', 'Solomon Islands', 'Somalia', 'South Africa', 'South Korea', 'South Sudan', 'Spain', 'Sri Lanka', 'Sudan', 'Suriname', 'Sweden', 'Switzerland', 'Syria', 'Taiwan', 'Tajikistan', 'Tanzania', 'Thailand', 'Togo', 'Tonga', 'Trinidad and Tobago', 'Tunisia', 'Turkey', 'Turkmenistan', 'Tuvalu', 'Uganda', 'Ukraine', 'United Arab Emirates', 'United Kingdom', 'United States', 'Uruguay', 'Uzbekistan', 'Vanuatu', 'Vatican City', 'Venezuela', 'Vietnam', 'Yemen', 'Zambia', 'Zimbabwe'])
export const role = pgEnum("role", ['NORMAL_USER', 'EDITOR', 'REVIEWER', 'ADMIN'])
export const salutation = pgEnum("salutation", ['Mr', 'Mrs', 'Ms', 'Dr', 'Prof', 'Rev'])


export const user = pgTable("user", {
	id: text().primaryKey().notNull(),
	firstName: text(),
	lastName: text(),
	affiliation: text(),
	country: countries(),
	role: role(),
	email: text(),
	emailVerified: timestamp({ mode: 'string' }),
	password: text(),
}, (table) => {
	return {
		userEmailUnique: unique("user_email_unique").on(table.email),
	}
});

export const articleSubmissions = pgTable("article_submissions", {
	id: text().primaryKey().notNull(),
	section: artticleType(),
	requirements: text().array().notNull(),
	commentsForEditor: text("comments_for_editor").notNull(),
	userId: text().notNull(),
	createdAt: date().defaultNow(),
}, (table) => {
	return {
		articleSubmissionsUserIdUserIdFk: foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "article_submissions_userId_user_id_fk"
		}).onDelete("cascade"),
	}
});

export const contributor = pgTable("contributor", {
	id: text().primaryKey().notNull(),
	name: text().notNull(),
	salutation: salutation(),
	country: countries(),
	homepage: text(),
	orcid: text(),
	affiliation: text().notNull(),
	bio: text().notNull(),
	role: text().notNull(),
	userId: text().notNull(),
	articleId: text(),
}, (table) => {
	return {
		contributorUserIdUserIdFk: foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "contributor_userId_user_id_fk"
		}).onDelete("cascade"),
		contributorArticleIdArticleSubmissionsIdFk: foreignKey({
			columns: [table.articleId],
			foreignColumns: [articleSubmissions.id],
			name: "contributor_articleId_article_submissions_id_fk"
		}).onDelete("cascade"),
	}
});

export const files = pgTable("files", {
	id: text().primaryKey().notNull(),
	publicId: text().notNull(),
	resourceType: text().notNull(),
	originalName: text().notNull(),
	fileType: text(),
	userId: text().notNull(),
	articleId: text(),
}, (table) => {
	return {
		filesUserIdUserIdFk: foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "files_userId_user_id_fk"
		}).onDelete("cascade"),
		filesArticleIdArticleSubmissionsIdFk: foreignKey({
			columns: [table.articleId],
			foreignColumns: [articleSubmissions.id],
			name: "files_articleId_article_submissions_id_fk"
		}).onDelete("cascade"),
		filesPublicIdUnique: unique("files_publicId_unique").on(table.publicId),
	}
});

export const finalSubmissions = pgTable("final_submissions", {
	id: text().primaryKey().notNull(),
	funded: boolean().notNull(),
	ethical: boolean().notNull(),
	consent: boolean().notNull(),
	human: boolean().notNull(),
	founders: text(),
	ethicalReference: varchar("ethical_reference", { length: 255 }),
	userId: text().notNull(),
	articleId: text(),
}, (table) => {
	return {
		finalSubmissionsUserIdUserIdFk: foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "final_submissions_userId_user_id_fk"
		}).onDelete("cascade"),
		finalSubmissionsArticleIdArticleSubmissionsIdFk: foreignKey({
			columns: [table.articleId],
			foreignColumns: [articleSubmissions.id],
			name: "final_submissions_articleId_article_submissions_id_fk"
		}).onDelete("cascade"),
	}
});

export const metadata = pgTable("metadata", {
	id: text().primaryKey().notNull(),
	title: text().notNull(),
	prefix: text().notNull(),
	subtitle: text().notNull(),
	abstract: text().notNull(),
	userId: text().notNull(),
	articleId: text(),
}, (table) => {
	return {
		metadataUserIdUserIdFk: foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "metadata_userId_user_id_fk"
		}).onDelete("cascade"),
		metadataArticleIdArticleSubmissionsIdFk: foreignKey({
			columns: [table.articleId],
			foreignColumns: [articleSubmissions.id],
			name: "metadata_articleId_article_submissions_id_fk"
		}).onDelete("cascade"),
		metadataTitleUnique: unique("metadata_title_unique").on(table.title),
	}
});

export const reviewers = pgTable("reviewers", {
	id: text().primaryKey().notNull(),
	names: varchar({ length: 255 }).notNull(),
	affiliation: varchar({ length: 255 }).notNull(),
	email: varchar({ length: 255 }).notNull(),
	phone: varchar({ length: 20 }),
	expertise: text().notNull(),
	userId: text().notNull(),
	articleId: text(),
}, (table) => {
	return {
		reviewersUserIdUserIdFk: foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "reviewers_userId_user_id_fk"
		}).onDelete("cascade"),
		reviewersArticleIdArticleSubmissionsIdFk: foreignKey({
			columns: [table.articleId],
			foreignColumns: [articleSubmissions.id],
			name: "reviewers_articleId_article_submissions_id_fk"
		}).onDelete("cascade"),
	}
});

export const session = pgTable("session", {
	sessionToken: text().primaryKey().notNull(),
	userId: text().notNull(),
	expires: timestamp({ mode: 'string' }).notNull(),
}, (table) => {
	return {
		sessionUserIdUserIdFk: foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "session_userId_user_id_fk"
		}).onDelete("cascade"),
	}
});

export const verificationToken = pgTable("verificationToken", {
	identifier: text().notNull(),
	token: text().notNull(),
	expires: timestamp({ mode: 'string' }).notNull(),
}, (table) => {
	return {
		verificationTokenIdentifierTokenPk: primaryKey({ columns: [table.identifier, table.token], name: "verificationToken_identifier_token_pk"}),
	}
});

export const passwordResets = pgTable("passwordResets", {
	identifier: text().notNull(),
	token: text().notNull(),
	password: text().notNull(),
	expires: timestamp({ mode: 'string' }).notNull(),
}, (table) => {
	return {
		passwordResetsIdentifierTokenPk: primaryKey({ columns: [table.identifier, table.token], name: "passwordResets_identifier_token_pk"}),
	}
});

export const authenticator = pgTable("authenticator", {
	credentialId: text().notNull(),
	userId: text().notNull(),
	providerAccountId: text().notNull(),
	credentialPublicKey: text().notNull(),
	counter: integer().notNull(),
	credentialDeviceType: text().notNull(),
	credentialBackedUp: boolean().notNull(),
	transports: text(),
}, (table) => {
	return {
		authenticatorUserIdUserIdFk: foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "authenticator_userId_user_id_fk"
		}).onDelete("cascade"),
		authenticatorUserIdCredentialIdPk: primaryKey({ columns: [table.credentialId, table.userId], name: "authenticator_userId_credentialID_pk"}),
		authenticatorCredentialIdUnique: unique("authenticator_credentialID_unique").on(table.credentialId),
	}
});

export const account = pgTable("account", {
	userId: text().notNull(),
	type: text().notNull(),
	provider: text().notNull(),
	providerAccountId: text().notNull(),
	refreshToken: text("refresh_token"),
	accessToken: text("access_token"),
	expiresAt: integer("expires_at"),
	tokenType: text("token_type"),
	scope: text(),
	idToken: text("id_token"),
	sessionState: text("session_state"),
}, (table) => {
	return {
		accountUserIdUserIdFk: foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "account_userId_user_id_fk"
		}).onDelete("cascade"),
		accountProviderProviderAccountIdPk: primaryKey({ columns: [table.provider, table.providerAccountId], name: "account_provider_providerAccountId_pk"}),
	}
});
