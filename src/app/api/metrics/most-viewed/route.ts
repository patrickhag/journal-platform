import { db } from '@/db/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const currentData = await db.query.metrics.findMany({
      columns: {
        id: true,
        views: true,
      },
      with: {
        publishedArticle: {
          columns: {
            slug: true,
          },
          with: {
            article: {
              columns: {
                id: true,
              },
              with: {
                metadata: {
                  columns: {
                    title: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    const topMetrics = currentData
      .sort((a, b) => (b.views ?? 0) - (a.views ?? 0))
      .slice(0, 3);

    return NextResponse.json(topMetrics);
  } catch (err) {
    console.error('Error fetching metrics:', err);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch metrics data' },
      { status: 500 }
    );
  }
}
