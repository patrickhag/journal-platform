import { db } from '@/db/db';
import { metrics, citations } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

type Params = { slug: string };

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<Params> }
) {
  try {
    const { slug } = await params;

    const metricData = await db
      .select({
        views: metrics.views,
        downloads: metrics.downloads,
        id: metrics.id,
      })
      .from(metrics)
      .where(eq(metrics.articleSlug, slug))
      .limit(1);

    if (!metricData.length) {
      return NextResponse.json({
        views: 0,
        downloads: 0,
        citations: {
          bibtexFormat: 0,
          risFormat: 0,
          apaStyle: 0,
          amaStyle: 0,
        },
      });
    }

    const metric = metricData[0];

    // Try to get citations data, but handle if table doesn't exist yet
    let citationData = {
      bibtexFormat: 0,
      risFormat: 0,
      apaStyle: 0,
      amaStyle: 0,
    };

    try {
      const citationsResult = await db
        .select({
          bibtexFormat: citations.bibtexFormat,
          risFormat: citations.risFormat,
          apaStyle: citations.apaStyle,
          amaStyle: citations.amaStyle,
        })
        .from(citations)
        .where(eq(citations.metricId, metric.id))
        .limit(1);

      if (citationsResult.length) {
        citationData = {
          bibtexFormat: citationsResult[0].bibtexFormat || 0,
          risFormat: citationsResult[0].risFormat || 0,
          apaStyle: citationsResult[0].apaStyle || 0,
          amaStyle: citationsResult[0].amaStyle || 0,
        };
      }
    } catch (citationsError) {
      // Citations table doesn't exist yet or other error - use defaults
      console.warn('Citations table not available:', citationsError);
    }

    return NextResponse.json({
      views: metric.views || 0,
      downloads: metric.downloads || 0,
      citations: citationData,
    });
  } catch (err) {
    console.error('Error fetching metric:', err);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch metric data' },
      { status: 500 }
    );
  }
}
