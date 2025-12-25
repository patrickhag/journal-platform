import { db } from '@/db/db';
import { publishedArticles } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const searchQuery = url.searchParams.get('searchQuery')?.trim() || '';
  const title = url.searchParams.get('title')?.trim() || '';
  const keywords = url.searchParams.get('keywords')?.trim() || '';
  const author = url.searchParams.get('author')?.trim() || '';
  const affiliation = url.searchParams.get('affiliation')?.trim() || '';
  const fromDate = url.searchParams.get('fromDate');
  const toDate = url.searchParams.get('toDate');
  const volume = url.searchParams.get('volume')?.trim() || '';
  const issue = url.searchParams.get('issue')?.trim() || '';

  // If no filters are provided, return empty array
  if (
    !searchQuery &&
    !title &&
    !keywords &&
    !author &&
    !affiliation &&
    !fromDate &&
    !toDate &&
    !volume &&
    !issue
  ) {
    return NextResponse.json([]);
  }

  let articles = await db.query.publishedArticles.findMany({
    where: eq(publishedArticles.status, 'PUBLISHED'),
    columns: {
      id: true,
      slug: true,
      publishedAt: true,
    },
    with: {
      article: {
        columns: {
          id: true,
        },
        with: {
          user: {
            columns: {
              firstName: true,
              lastName: true,
              affiliation: true,
            },
          },
          metadata: {
            columns: {
              title: true,
              topics: true,
            },
          },
          contributors: {
            columns: {
              name: true,
              affiliation: true,
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
              volumeNumber: true,
              year: true,
            },
          },
        },
      },
    },
  });

  // Apply filters
  articles = articles.filter((article) => {
    // Search Query - searches in title
    if (searchQuery) {
      const titleMatch = article.article.metadata?.title
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase());
      if (!titleMatch) return false;
    }

    // Title filter
    if (title) {
      const titleMatch = article.article.metadata?.title
        ?.toLowerCase()
        .includes(title.toLowerCase());
      if (!titleMatch) return false;
    }

    // Keywords filter - searches in topics array
    if (keywords) {
      const topics = article.article.metadata?.topics || [];
      const keywordsLower = keywords.toLowerCase();
      const keywordsMatch = topics.some((topic) =>
        topic.toLowerCase().includes(keywordsLower)
      );
      if (!keywordsMatch) return false;
    }

    // Author filter - searches in user name and contributors
    if (author) {
      const authorLower = author.toLowerCase();
      const userFirstName =
        article.article.user?.firstName?.toLowerCase() || '';
      const userLastName = article.article.user?.lastName?.toLowerCase() || '';
      const userFullName = `${userFirstName} ${userLastName}`.trim();
      const userMatch = userFullName.includes(authorLower);

      const contributorsMatch = article.article.contributors?.some(
        (contributor) => contributor.name?.toLowerCase().includes(authorLower)
      );

      if (!userMatch && !contributorsMatch) return false;
    }

    // Affiliation filter - searches in user affiliation and contributors affiliation
    if (affiliation) {
      const affiliationLower = affiliation.toLowerCase();
      const userAffiliation =
        article.article.user?.affiliation?.toLowerCase() || '';
      const userMatch = userAffiliation.includes(affiliationLower);

      const contributorsMatch = article.article.contributors?.some(
        (contributor) =>
          contributor.affiliation?.toLowerCase().includes(affiliationLower)
      );

      if (!userMatch && !contributorsMatch) return false;
    }

    // Date range filter
    if (fromDate || toDate) {
      const publishedDate = article.publishedAt
        ? new Date(article.publishedAt)
        : null;

      if (!publishedDate) return false;

      if (fromDate) {
        const from = new Date(fromDate);
        if (publishedDate < from) return false;
      }

      if (toDate) {
        const to = new Date(toDate);
        // Set to end of day for inclusive comparison
        to.setHours(23, 59, 59, 999);
        if (publishedDate > to) return false;
      }
    }

    // Volume filter
    if (volume) {
      const volumeNumber = parseInt(volume, 10);
      const articleVolumeNumber = article.issue?.volume?.volumeNumber;
      if (articleVolumeNumber !== volumeNumber) return false;
    }

    // Issue filter
    if (issue) {
      const issueNumber = parseInt(issue, 10);
      const articleIssueNumber = article.issue?.issueNumber;
      if (articleIssueNumber !== issueNumber) return false;
    }

    return true;
  });

  return NextResponse.json(articles);
}
