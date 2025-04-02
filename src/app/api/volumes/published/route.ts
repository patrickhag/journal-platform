import { db } from '@/db/db';
import { issues, volumes } from '@/db/schema';
import { desc, eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const result = await db.query.volumes.findMany({
      columns: {
        id: true,
        volumeNumber: true,
        year: true,
      },
      where: eq(volumes.status, 'Active'),
      with: {
        issues: {
          columns: {
            id: true,
            publicationDate: true,
            issueNumber: true,
          },
          where: eq(issues.status, 'Published'),
          orderBy: desc(issues.publicationDate),
          with: {
            articles: {
              columns: {
                id: true,
              },
            },
          },
        },
      },
      orderBy: desc(volumes.year),
    });

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch published volumes' },
      { status: 500 }
    );
  }
}
