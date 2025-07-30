import { db } from '@/db/db';
import { metrics } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

type Params = { slug: string };

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<Params> }
) {
  try {
    const { slug } = await params;

    const currentData = await db.query.metrics.findFirst({
      where: eq(metrics.articleSlug, slug),
      columns: {
        views: true,
        downloads: true,
      },
    });

    return NextResponse.json(currentData);
  } catch (err) {
    console.error('Error fetching metric:', err);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch metric data' },
      { status: 500 }
    );
  }
}
