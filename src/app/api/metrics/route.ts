import { db } from '@/db/db';
import { metrics } from '@/db/schema';
import { NextRequest, NextResponse } from 'next/server';
import { sql, eq, gte, lte, and } from 'drizzle-orm';
import { subMonths, subYears, startOfMonth, endOfMonth } from 'date-fns';
import { auth } from '@/auth';

export async function POST(req: NextRequest) {
  const { articleId, downloadCount, viewCount } = await req.json();

  try {
    const metricsRecord = await db
      .select()
      .from(metrics)
      .where(eq(metrics.articleId, articleId))
      .execute();

    if (!metricsRecord.length) {
      await db.insert(metrics).values({
        articleId,
        views: viewCount ? 1 : 0,
        downloads: downloadCount ? 1 : 0,
      });

      return NextResponse.json({
        success: true,
        message: viewCount ? 'View count added' : 'Download count added',
      });
    }

    if (viewCount) {
      await db
        .update(metrics)
        .set({
          views: sql`${metrics.views} + 1`,
          updatedAt: new Date(),
        })
        .where(eq(metrics.articleId, articleId));

      return NextResponse.json({ success: true, message: 'View count added' });
    }

    if (downloadCount) {
      await db
        .update(metrics)
        .set({
          downloads: sql`${metrics.downloads} + 1`,
          updatedAt: new Date(),
        })
        .where(eq(metrics.articleId, articleId));

      return NextResponse.json({
        success: true,
        message: 'Download count added',
      });
    }

    return NextResponse.json({
      success: false,
      message: 'No action specified (downloadCount or viewCount required)',
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { success: false, error: 'Failed to increment' },
      { status: 500 }
    );
  }
}

export async function GET(res: NextResponse, req: NextRequest) {
  try {
    const session = await auth();

    // if (
    //   !(session?.user.role === 'ADMIN' || session?.user.role === 'CHIEF_EDITOR')
    // ) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    const currentData = await db.query.metrics.findMany();

    const sumInteractions = (data: typeof currentData) =>
      data.reduce(
        (acc, curr) => acc + (curr.views ?? 0) + (curr.downloads ?? 0),
        0
      );

    const totalCurrent = sumInteractions(currentData);

    return NextResponse.json({
      totalInteractions: totalCurrent,
    });
  } catch (err) {
    console.error('Error fetching metrics:', err);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch metrics data' },
      { status: 500 }
    );
  }
}
