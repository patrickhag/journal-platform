import { auth } from '@/auth';
import { withUpload } from '@/lib/withUpload';
import {
  articleSubmissions,
  contributors as contributorsTable,
  db,
  files as filesTable,
  finalSubmissions,
  metadata as metadataTable,
  reviewers as reviewersTable,
  users,
} from '@/db/schema';
import { ilike, eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';
import type formidable from 'formidable';
import {
  notifyAdmin,
  notifyContibutor,
  thankAuthorAboutSubmission,
} from '@/lib/emailTransporter';

type ManuscriptPayload = {
  sectionType: string;
  submissionRequirements: string[];
  editorComments?: string;
  metadata: {
    prefix: string;
    title: string;
    subtitle?: string;
    abstract: string;
    topics: string[];
  };
  contributors: Array<{
    name: string;
    salutation?: string;
    email: string;
    country?: string;
    orcid?: string;
    affiliation: string;
    bio: string;
    role: string;
  }>;
  reviewers: Array<{
    names: string;
    affiliation: string;
    email: string;
    phone?: string;
    expertise: string;
  }>;
  finalSubmission: {
    funded: 'yes' | 'no';
    ethical: 'yes' | 'no';
    consent: 'yes' | 'no';
    human: 'yes' | 'no';
    founders?: string;
    ethicalReference?: string;
  };
};

const normalizeFiles = (files: formidable.Files): formidable.File[] => {
  const list: formidable.File[] = [];

  for (const value of Object.values(files)) {
    if (Array.isArray(value)) {
      list.push(...value);
    } else if (value) {
      list.push(value);
    }
  }

  return list;
};

export const runtime = 'nodejs';

export const POST = withUpload(async ({ fields, files, upload }) => {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const payloadField = Array.isArray(fields.payload)
      ? fields.payload[0]
      : fields.payload;

    if (typeof payloadField !== 'string') {
      return NextResponse.json(
        { message: 'Invalid submission payload.' },
        { status: 400 }
      );
    }

    const payload = JSON.parse(payloadField) as ManuscriptPayload;

    const uploadFiles = normalizeFiles(files).filter((file) => file?.filepath);

    const uploadedFiles = await Promise.all(
      uploadFiles.map(async (file) => {
        const result = await upload(file);
        return {
          publicId: result.url,
          resourceType: result.mimetype ?? null,
          originalName: result.originalFilename,
          fileType: result.mimetype ?? null,
        };
      })
    );

    const existingMetadata = await db
      .select()
      .from(metadataTable)
      .where(ilike(metadataTable.title, payload.metadata.title))
      .limit(1);

    if (existingMetadata.length > 0) {
      return NextResponse.json(
        {
          message: 'Seems like you have already submitted this manuscript.',
        },
        { status: 409 }
      );
    }

    const userId = session.user.id;
    const authorName = session.user.name ?? 'Author';

    const [userRecord] = await db
      .select({ email: users.email })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);
    const userEmail = userRecord?.email;

    const articleId = await db.transaction(async (trx) => {
      const [article] = await trx
        .insert(articleSubmissions)
        .values({
          section: payload.sectionType,
          requirements: payload.submissionRequirements,
          commentsForEditor: payload.editorComments,
          userId,
        })
        .returning({ id: articleSubmissions.id });

      if (!article) {
        throw new Error('Unable to create article submission.');
      }

      const articleId = article.id;

      for (const file of uploadedFiles) {
        await trx.insert(filesTable).values({
          ...file,
          userId,
          articleId,
        });
      }

      await trx.insert(metadataTable).values({
        ...payload.metadata,
        articleId,
      });

      if (payload.contributors?.length) {
        for (const contributor of payload.contributors) {
          await trx.insert(contributorsTable).values({
            name: contributor.name,
            salutation: contributor.salutation,
            email: contributor.email,
            country: contributor.country,
            orcid: contributor.orcid,
            affiliation: contributor.affiliation,
            bio: contributor.bio,
            role: contributor.role,
            articleId,
          });
        }
      }

      if (payload.reviewers?.length) {
        for (const reviewer of payload.reviewers) {
          await trx.insert(reviewersTable).values({
            names: reviewer.names,
            affiliation: reviewer.affiliation,
            email: reviewer.email,
            phone: reviewer.phone,
            expertise: reviewer.expertise,
            articleId,
          });
        }
      }

      await trx.insert(finalSubmissions).values({
        articleId,
        funded: payload.finalSubmission.funded === 'yes',
        ethical: payload.finalSubmission.ethical === 'yes',
        consent: payload.finalSubmission.consent === 'yes',
        human: payload.finalSubmission.human === 'yes',
        founders: payload.finalSubmission.founders,
        ethicalReference: payload.finalSubmission.ethicalReference,
      });

      await notifyAdmin({
        article: payload.metadata.title,
        authorName,
        subject: 'New Article Submission',
        articleId,
        participant: 'AUTHOR',
      });

      if (userEmail) {
        await thankAuthorAboutSubmission({
          articleTitle: payload.metadata.title,
          authorNames: authorName,
          authorEmail: userEmail,
        });
      }

      if (payload.contributors?.length) {
        for (const contributor of payload.contributors) {
          await notifyContibutor({
            subject: 'Thank You for Your Contribution!',
            toEmail: contributor.email,
            article: payload.metadata.title,
            originalAuthor: authorName,
            contributor: contributor.name,
          });
        }
      }

      return articleId;
    });

    return NextResponse.json({
      message: 'Manuscript submitted successfully.',
      articleId,
    });
  } catch (error) {
    console.error('[api/manuscripts] submission error', error);
    return NextResponse.json(
      { message: 'Failed to submit manuscript. Please try again.' },
      { status: 500 }
    );
  }
});
