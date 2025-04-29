import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db/db';
import { articleSubmissions, files } from '@/db/schema';
import { and, eq } from 'drizzle-orm';

type Params = {
  userId: string;
};

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<Params> }
) {
  try {
    const { userId } = await params;
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
          where: eq(files.fileType, 'Article Text'),
        },
      },
      where: and(
        eq(articleSubmissions.articleStatus, 'ACCEPTED'),
        eq(articleSubmissions.userId, userId)
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
