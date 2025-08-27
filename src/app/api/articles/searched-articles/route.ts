import { db } from '@/db/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const searchQuery = url.searchParams.get('searchQuery')?.trim() || '';

  if (!searchQuery) {
    return NextResponse.json([]);
  }

  let articles = await db.query.publishedArticles.findMany({
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
            },
          },
          metadata: {
            columns: {
              title: true,
            },
          },
          contributors: {
            columns: {
              name: true,
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

  if (searchQuery) {
    articles = articles.filter((article) =>
      article.article.metadata?.title
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase())
    );
  }

  return NextResponse.json(articles);
}
