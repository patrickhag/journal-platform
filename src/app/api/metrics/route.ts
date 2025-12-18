import { db } from '@/db/db';
import { metrics, citations } from '@/db/schema';
import { NextRequest, NextResponse } from 'next/server';
import { sql, eq } from 'drizzle-orm';

type CitationFormat = 'bibtexFormat' | 'risFormat' | 'apaStyle' | 'amaStyle';

export async function POST(req: NextRequest) {
  const {
    slug,
    downloadCount,
    viewCount,
    citationFormat,
  }: {
    slug: string;
    downloadCount?: boolean;
    viewCount?: boolean;
    citationFormat?: CitationFormat;
  } = await req.json();

  try {
    const metricsRecord = await db
      .select()
      .from(metrics)
      .where(eq(metrics.articleSlug, slug))
      .execute();

    if (!metricsRecord.length) {
      const newMetric = await db
        .insert(metrics)
        .values({
          articleSlug: slug,
          views: viewCount ? 1 : 0,
          downloads: downloadCount ? 1 : 0,
        })
        .returning();

      const metricId = newMetric[0].id;

      // Create citations entry
      await db.insert(citations).values({
        metricId,
        bibtexFormat: citationFormat === 'bibtexFormat' ? 1 : 0,
        risFormat: citationFormat === 'risFormat' ? 1 : 0,
        apaStyle: citationFormat === 'apaStyle' ? 1 : 0,
        amaStyle: citationFormat === 'amaStyle' ? 1 : 0,
      });

      return NextResponse.json({
        success: true,
        message: viewCount
          ? 'View count added'
          : citationFormat
            ? 'Citation count added'
            : 'Download count added',
      });
    }

    if (viewCount) {
      await db
        .update(metrics)
        .set({
          views: sql`${metrics.views} + 1`,
          updatedAt: new Date(),
        })
        .where(eq(metrics.articleSlug, slug));

      return NextResponse.json({ success: true, message: 'View count added' });
    }

    if (downloadCount) {
      await db
        .update(metrics)
        .set({
          downloads: sql`${metrics.downloads} + 1`,
          updatedAt: new Date(),
        })
        .where(eq(metrics.articleSlug, slug));

      return NextResponse.json({
        success: true,
        message: 'Download count added',
      });
    }

    if (citationFormat) {
      const metricRecord = metricsRecord[0];

      try {
        // Check if citations record exists, if not create it
        const citationsRecord = await db
          .select()
          .from(citations)
          .where(eq(citations.metricId, metricRecord.id))
          .execute();

        if (!citationsRecord.length) {
          await db.insert(citations).values({
            metricId: metricRecord.id,
            bibtexFormat: citationFormat === 'bibtexFormat' ? 1 : 0,
            risFormat: citationFormat === 'risFormat' ? 1 : 0,
            apaStyle: citationFormat === 'apaStyle' ? 1 : 0,
            amaStyle: citationFormat === 'amaStyle' ? 1 : 0,
          });
        } else {
          // Update the specific citation format
          const updateFields: {
            bibtexFormat?: ReturnType<typeof sql>;
            risFormat?: ReturnType<typeof sql>;
            apaStyle?: ReturnType<typeof sql>;
            amaStyle?: ReturnType<typeof sql>;
            updatedAt: Date;
          } = {
            updatedAt: new Date(),
          };

          if (citationFormat === 'bibtexFormat') {
            updateFields.bibtexFormat = sql`${citations.bibtexFormat} + 1`;
          } else if (citationFormat === 'risFormat') {
            updateFields.risFormat = sql`${citations.risFormat} + 1`;
          } else if (citationFormat === 'apaStyle') {
            updateFields.apaStyle = sql`${citations.apaStyle} + 1`;
          } else if (citationFormat === 'amaStyle') {
            updateFields.amaStyle = sql`${citations.amaStyle} + 1`;
          }

          await db
            .update(citations)
            .set(updateFields)
            .where(eq(citations.metricId, metricRecord.id));
        }

        return NextResponse.json({
          success: true,
          message: 'Citation count added',
        });
      } catch (citationError: any) {
        // If citations table doesn't exist yet, log warning but don't fail
        if (citationError?.code === '42P01') {
          console.warn(
            'Citations table does not exist. Please run database migrations.'
          );
          return NextResponse.json({
            success: false,
            error:
              'Citations table not found. Please run database migrations first.',
          });
        }
        throw citationError;
      }
    }

    return NextResponse.json({
      success: false,
      message:
        'No action specified (downloadCount, viewCount, or citationFormat required)',
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { success: false, error: 'Failed to increment' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const currentData = await db.query.metrics.findMany();

    const sumInteractions = (data: typeof currentData) =>
      data.reduce(
        (acc, curr) => acc + (curr.views ?? 0) + (curr.downloads ?? 0),
        0
      );

    const totalCurrent = sumInteractions(currentData);

    // Calculate total citations
    let totalCitations = 0;
    try {
      const allCitations = await db
        .select({
          bibtexFormat: citations.bibtexFormat,
          risFormat: citations.risFormat,
          apaStyle: citations.apaStyle,
          amaStyle: citations.amaStyle,
        })
        .from(citations);

      totalCitations = allCitations.reduce(
        (acc, curr) =>
          acc +
          (curr.bibtexFormat || 0) +
          (curr.risFormat || 0) +
          (curr.apaStyle || 0) +
          (curr.amaStyle || 0),
        0
      );
    } catch (citationsError) {
      // Citations table doesn't exist yet or other error - use default
      console.warn('Citations table not available:', citationsError);
      totalCitations = 0;
    }

    return NextResponse.json({
      totalInteractions: totalCurrent,
      totalCitations,
    });
  } catch (err) {
    console.error('Error fetching metrics:', err);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch metrics data' },
      { status: 500 }
    );
  }
}
