import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db/db';
import { eq } from 'drizzle-orm';
import { publishedArticles } from '@/db/schema';

type Params = { slug: string };

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<Params> }
) {
  const { slug } = await params;

  try {
    const publishedArticle = await db.query.publishedArticles.findFirst({
      where: eq(publishedArticles.slug, slug),
      columns: {
        id: true,
        doi: true,
        publishedAt: true,
        pdfUrl: true,
        pageRange: true,
        slug: true,
      },
      with: {
        article: {
          columns: {
            id: true,
            section: true,
            createdAt: true,
            acceptedAt: true,
          },
          with: {
            user: {
              columns: {
                firstName: true,
                lastName: true,
                affiliation: true,
                email: true,
                orcid: true,
              },
            },
            metadata: {
              columns: {
                prefix: true,
                title: true,
                subtitle: true,
                abstract: true,
                topics: true,
              },
            },
            contributors: {
              columns: {
                name: true,
                salutation: true,
                affiliation: true,
                email: true,
                orcid: true,
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

    return NextResponse.json(publishedArticle);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch published article' },
      { status: 500 }
    );
  }
}
