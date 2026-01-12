import LeftSideBar from '@/components/landingPage/leftSideBar';
import ArticleContent from './ArticleContent';
import { db } from '@/db/db';
import { eq } from 'drizzle-orm';
import { publishedArticles } from '@/db/schema';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import sanitizeHtml from 'sanitize-html';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ articleId: string }>;
}): Promise<Metadata> {
  const { articleId } = await params;

  const publishedArticle = await db.query.publishedArticles.findFirst({
    where: eq(publishedArticles.slug, articleId),
    columns: {
      id: true,
      doi: true,
      publishedAt: true,
      slug: true,
      articlePicture: true,
    },
    with: {
      article: {
        columns: {
          id: true,
          section: true,
        },
        with: {
          user: {
            columns: {
              firstName: true,
              lastName: true,
            },
          },
          metadata: {
            columns: {
              title: true,
              subtitle: true,
              abstract: true,
            },
          },
        },
      },
      issue: {
        columns: {
          issueNumber: true,
        },
        with: {
          volume: {
            columns: {
              year: true,
            },
          },
        },
      },
    },
  });

  if (!publishedArticle) {
    return {
      title: 'Article Not Found',
    };
  }

  const baseUrl = process.env.NEXT_PUBLIC_URL || '';
  const url = `${baseUrl}/articles/article/${publishedArticle.slug}`;
  const title = publishedArticle.article.metadata.title;
  const subtitle = publishedArticle.article.metadata.subtitle
    ? `: ${publishedArticle.article.metadata.subtitle}`
    : '';
  const fullTitle = `${title}${subtitle}`;

  const description = publishedArticle.article.metadata.abstract
    ? sanitizeHtml(publishedArticle.article.metadata.abstract, {
        allowedTags: [],
        allowedAttributes: {},
      })
    : `Published in Journal of African Epidemiology and Public Health, Volume ${publishedArticle.issue?.volume.year}, Issue ${publishedArticle.issue?.issueNumber}`;
  const authorName = `${publishedArticle.article.user.firstName} ${publishedArticle.article.user.lastName}`;
  const imageUrl = `${baseUrl}/jaep-logo.png`;

  return {
    title: fullTitle,
    description: description.substring(0, 160), // Limit description length for SEO
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: `${fullTitle} | Journal of African Epidemiology and Public Health`,
      description: description.substring(0, 200),
      url: url,
      siteName: 'Journal of African Epidemiology and Public Health',
      images: [
        {
          url: publishedArticle.articlePicture || imageUrl,
          width: 1200,
          height: 630,
          alt: fullTitle,
        },
      ],
      locale: 'en_US',
      type: 'article',
      publishedTime: publishedArticle.publishedAt
        ? new Date(publishedArticle.publishedAt).toISOString()
        : undefined,
      authors: [authorName],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${fullTitle} | Journal of African Epidemiology and Public Health`,
      description: description.substring(0, 200),
      images: [imageUrl],
    },
    other: {
      'article:author': authorName,
      'article:section': publishedArticle.article.section || '',
      'article:published_time': publishedArticle.publishedAt
        ? new Date(publishedArticle.publishedAt).toISOString()
        : '',
      ...(publishedArticle.doi && { 'citation:doi': publishedArticle.doi }),
    },
  };
}

export default async function PublicArticleView() {
  return (
    <div className="px-2.5 md:px-8 py-2.5 md:py-6">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          <ArticleContent />
        </div>
        <LeftSideBar />
      </div>
    </div>
  );
}
