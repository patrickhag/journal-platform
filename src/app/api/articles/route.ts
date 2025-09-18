import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db/db';
import { eq } from 'drizzle-orm';
import { articleSubmissions } from '@/db/schema';

export async function GET(req: NextRequest) {
  try {
    const articles = await db.query.articleSubmissions.findMany({
      columns: {
        id: true,
        createdAt: true,
        updatedAt: true,
        articleStatus: true,
        acceptedAt: true,
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
            prefix: true,
            abstract: true,
          },
        },
        files: {
          columns: {
            publicId: true,
          },
        },
      },
      where: eq(articleSubmissions.articleStatus, 'ACCEPTED'),
    });

    return NextResponse.json(articles);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch articles' },
      { status: 500 }
    );
  }
}
