import { auth } from '@/auth';
import { db } from '@/db/db';
import { articleSubmissions } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

type Params = { articleId: string };

export async function GET(
  request: Request,
  { params }: { params: Promise<Params> }
) {
  try {
    const { articleId } = await params;

    if (!articleId) {
      return NextResponse.json(
        { error: 'Article ID is required' },
        { status: 400 }
      );
    }

    const reviews = await db.query.articleSubmissions.findFirst({
      where: eq(articleSubmissions.id, articleId),
      columns: {
        articleStatus: true,
      },
      with: {
        metadata: {
          columns: {
            title: true,
          },
        },
        user: {
          columns: {
            firstName: true,
            lastName: true,
          },
        },
        reviews: {
          with: {
            user: {
              columns: {
                firstName: true,
                lastName: true,
                email: true,
                prefix: true,
              },
            },
          },
        },
        editorActions: {
          columns: {
            id: true,
          },
        },
      },
    });

    return NextResponse.json(reviews);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
