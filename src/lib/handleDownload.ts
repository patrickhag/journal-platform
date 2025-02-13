'use server';

import { articleSubmissions } from '@/db/schema';
import { db } from '@/db/db';
import { eq } from 'drizzle-orm';
import logger from '@/lib/logger';
import { grabYear } from './formateDate';

export const handleDownload = async (
  format: 'bibtex' | 'ris',
  articleId: string
) => {
  let articleData;

  try {
    articleData = await db.query.articleSubmissions.findFirst({
      columns: {
        id: true,
        updatedAt: true,
        section: true,
      },
      with: {
        metadata: {
          columns: {
            title: true,
            subtitle: true,
            abstract: true,
          },
        },
        user: {
          columns: {
            firstName: true,
            lastName: true,
            affiliation: true,
            email: true,
            orcid: true,
          },
        },
        files: {
          columns: {
            publicId: true,
            fileType: true,
          },
        },
        contributors: {
          columns: {
            name: true,
            role: true,
            affiliation: true,
            orcid: true,
            email: true,
          },
        },
      },
      where: eq(articleSubmissions.id, articleId),
    });

    if (format === 'bibtex') {
      const bibContent = generateBibTeX(articleData);
      return {
        success: true,
        content: bibContent,
        filename: `citation-${articleId}.bib`,
      };
    }

    if (format === 'ris') {
      const risContent = generateRIS(articleData);
      return {
        success: true,
        content: risContent,
        filename: `citation-${articleId}.ris`,
      };
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      logger.error(error.message);
    } else {
      logger.error('An unknown error occurred');
    }
  }
};

function generateBibTeX(article: any) {
  return `@article{${article.id},
  title={${article.metadata.title}},
  author={${formatAuthors(article.user, article.contributors)}},
  journal={Journal of Epidemiology and Public Health},
  year={${grabYear(article.updatedAt)}},
  abstract={${article.metadata.abstract}},
  volume={},
  number={},
  pages={},
  doi={${article.id}}
}`;
}

function generateRIS(article: any) {
  return `TY  - JOUR
  TI  - ${article.metadata.title}
  AU  - ${formatAuthors(article.user, article.contributors)}
  JO  - Journal of Epidemiology and Public Health
  AB  - ${article.metadata.abstract}
  PY  - ${grabYear(article.updatedAt)}
  DO  - ${article.id}
  ER  -`;
}

function formatAuthors(mainAuthor: any, contributors: any[]) {
  const authors = [
    `${mainAuthor.lastName || ''}, ${mainAuthor.firstName || ''}`,
    ...contributors.map(
      (c) =>
        `${c.name.split(' ').slice(-1)}, ${c.name.split(' ').slice(0, -1).join(' ')}`
    ),
  ];
  return authors.join(' and ');
}

export default handleDownload;
