/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db/drizzle';

export async function GET(req: NextRequest) {
  try {
    const articles = await db.query.articleSubmissions.findMany({
      columns: {
        section: true,
        articleStatus: true,
        createdAt: true,
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
      },
    });

    return NextResponse.json({ articles }, { status: 200 });
  } catch (error) {
    console.error('Error fetching articles:', error);
    return NextResponse.json(
      { error: 'Failed to fetch articles' },
      { status: 500 }
    );
  }
}
