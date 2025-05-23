import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db/db';
import { eq, or } from 'drizzle-orm';
import { articleSubmissions, files } from '@/db/schema';

export async function GET(req: NextRequest) {
  try {
    const articles = await db.query.articleSubmissions.findMany({
      columns: {
        id: true,
        createdAt: true,
        updatedAt: true,
        articleStatus: true,
        proofStatus: true,
        proofFileUrl: true,
        proofNote: true,
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
          },
        },
        files: {
          columns: {
            publicId: true,
          },
        },
      },
      where: or(
        eq(articleSubmissions.articleStatus, 'ACCEPTED'),
        eq(articleSubmissions.articleStatus, 'PUBLISHED')
      ),
    });

    return NextResponse.json(articles);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch articles' },
      { status: 500 }
    );
  }
}
