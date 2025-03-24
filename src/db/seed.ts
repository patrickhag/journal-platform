import bcrypt from 'bcryptjs';
const PASSWORD = 'whyoneAt@1';

const hashedPassword = bcrypt.hashSync(PASSWORD);
import {
  db,
  users,
  files,
  metadata,
  contributors,
  reviewers,
  reviews,
  articleSubmissions,
  finalSubmissions,
  notifications,
  TUsers,
  ArticleSubmissions,
  Notifications,
} from './schema';
import { faker } from '@faker-js/faker';
import {
  ARTICLE_STATUS,
  ARTICLE_TYPES,
  COUNTRIES,
  SALUTATION,
} from '@/lib/consts';

async function seedDatabase() {
  // Create 10 users first since other tables reference them
  const userRecords = Array.from(
    { length: 30 },
    () =>
      ({
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        affiliation: faker.company.name(),
        country: faker.helpers.arrayElement(COUNTRIES),
        email: faker.internet.email(),
        emailVerified: new Date(),
        isActive: true,
        password: hashedPassword,
        avatar: faker.image.avatar(),
        role: faker.helpers.arrayElement([
          'NORMAL_USER',
          'ADMIN',
          'CHIEF_EDITOR',
        ]),
        id: faker.string.uuid(),
      }) satisfies TUsers
  );

  await db.insert(users).values(userRecords);

  // Verification tokens
  // const verificationTokenRecords = Array.from({ length: 10 }, () => ({
  //   identifier: faker.string.uuid(),
  //   token: faker.string.alphanumeric(32),
  //   expires: faker.date.future(),
  // }));

  // await db.insert(verificationTokens).values(verificationTokenRecords);

  // Authenticators
  // const authenticatorRecords = Array.from({ length: 10 }, () => ({
  //   credentialID: faker.string.uuid(),
  //   userId: faker.helpers.arrayElement(userRecords).id,
  //   providerAccountId: faker.string.uuid(),
  //   credentialPublicKey: faker.string.alphanumeric(64),
  //   counter: faker.number.int({ min: 1, max: 1000 }),
  //   credentialDeviceType: faker.helpers.arrayElement([
  //     'platform',
  //     'cross-platform',
  //   ]),
  //   credentialBackedUp: faker.datatype.boolean(),
  //   transports: faker.helpers.arrayElement(['usb', 'nfc', 'ble']),
  // }));

  // await db.insert(authenticators).values(authenticatorRecords);

  // Create article submissions first since they're referenced by other tables
  const articleSubmissionRecords = Array.from(
    { length: 12 },
    () =>
      ({
        id: crypto.randomUUID(),
        section: faker.helpers.arrayElement(ARTICLE_TYPES),
        requirements: Array.from({ length: 3 }, () => faker.lorem.sentence()),
        commentsForEditor: faker.lorem.paragraph(),
        articleStatus: faker.helpers.arrayElement(ARTICLE_STATUS),
        userId: faker.helpers.arrayElement(userRecords).id,
      }) satisfies ArticleSubmissions
  );

  await db.insert(articleSubmissions).values(articleSubmissionRecords);

  // Files
  const fileRecords = Array.from({ length: 12 }, () => ({
    id: crypto.randomUUID(),
    publicId: faker.string.uuid(),
    resourceType: faker.helpers.arrayElement(['image', 'document', 'video']),
    originalName: faker.system.fileName(),
    fileType: faker.system.fileExt(),
    userId: faker.helpers.arrayElement(userRecords).id,
    articleId: faker.helpers.arrayElement(articleSubmissionRecords).id,
  }));

  await db.insert(files).values(fileRecords);

  // Metadata
  const metadataRecords = Array.from({ length: 12 }, () => ({
    id: crypto.randomUUID(),
    title: faker.lorem.sentence(),
    prefix: faker.helpers.arrayElement(['Dr', 'Prof', 'Mr', 'Mrs']),
    subtitle: faker.lorem.sentence(),
    abstract: faker.lorem.paragraphs(2),
    userId: faker.helpers.arrayElement(userRecords).id,
    articleId: faker.helpers.arrayElement(articleSubmissionRecords).id,
  }));

  await db.insert(metadata).values(metadataRecords);

  // Contributors
  const contributorRecords = Array.from({ length: 12 }, () => ({
    id: crypto.randomUUID(),
    name: faker.person.fullName(),
    salutation: faker.helpers.arrayElement(SALUTATION),
    country: faker.helpers.arrayElement(COUNTRIES),
    orcid: faker.string.numeric(16),
    affiliation: faker.company.name(),
    bio: faker.lorem.paragraph(),
    role: faker.helpers.arrayElement([
      'Lead Author',
      'Co-Author',
      'Researcher',
    ]),
    userId: faker.helpers.arrayElement(userRecords).id,
    articleId: faker.helpers.arrayElement(articleSubmissionRecords).id,
  }));

  await db.insert(contributors).values(contributorRecords);

  // Reviewers
  const reviewerRecords = Array.from({ length: 12 }, () => ({
    id: crypto.randomUUID(),
    names: faker.person.fullName(),
    affiliation: faker.company.name(),
    email: faker.internet.email(),
    phone: faker.phone.number(),
    expertise: faker.lorem.words(3),
    acceptedInvitation: faker.datatype.boolean(),
    userId: faker.helpers.arrayElement(userRecords).id,
    articleId: faker.helpers.arrayElement(articleSubmissionRecords).id,
  }));

  await db.insert(reviewers).values(reviewerRecords);

  // Reviews
  const reviewRecords = Array.from({ length: 12 }, () => ({
    id: crypto.randomUUID(),
    message: faker.lorem.paragraphs(2),
    userId: faker.helpers.arrayElement(userRecords).id,
    articleId: faker.helpers.arrayElement(articleSubmissionRecords).id,
    fileIds: Array.from(
      { length: 2 },
      () => faker.helpers.arrayElement(fileRecords).id
    ),
    status: faker.helpers.arrayElement(ARTICLE_STATUS),
  }));

  await db.insert(reviews).values(reviewRecords);

  // Final Submissions
  const finalSubmissionRecords = Array.from({ length: 12 }, () => ({
    id: crypto.randomUUID(),
    funded: faker.datatype.boolean(),
    ethical: faker.datatype.boolean(),
    consent: faker.datatype.boolean(),
    human: faker.datatype.boolean(),
    founders: faker.company.name(),
    ethicalReference: faker.string.alphanumeric(10),
    articleId: faker.helpers.arrayElement(articleSubmissionRecords).id,
  }));

  await db.insert(finalSubmissions).values(finalSubmissionRecords);

  // Notifications
  const notificationRecords = Array.from(
    { length: 500 },
    () =>
      ({
        id: crypto.randomUUID(),
        message: faker.lorem.sentence(),
        kind: faker.helpers.arrayElement([
          'Warning',
          'Info',
          'Hint',
          'Error',
          'Confused',
          'Ok',
        ]),
        isRead: faker.datatype.boolean(),
        userId: faker.helpers.arrayElement(userRecords).id,
      }) satisfies Notifications
  );

  await db.insert(notifications).values(notificationRecords);

  console.log('Database seeded successfully!');
}

export default seedDatabase;
export const main = async () => {
  await seedDatabase();
};
