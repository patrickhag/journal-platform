import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db/db';
import { ads } from '@/db/schema';
import { lte, gte, and, eq } from 'drizzle-orm';

export async function GET(req: NextRequest) {
  try {
    const now = new Date().toISOString().split('T')[0];

    const adverts = await db.query.ads.findMany({
      where: and(eq(ads.isActive, true), gte(ads.endDate, now)),
    });

    return NextResponse.json(adverts);
  } catch (error) {
    console.error('Error fetching ads:', error);
    return NextResponse.json({ error: 'Failed to fetch ads' }, { status: 500 });
  }
}
