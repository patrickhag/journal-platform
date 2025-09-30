import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db/db';
import { ads } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(req: NextRequest) {
  try {
    const now = new Date().toISOString().split('T')[0];

    const adverts = await db.query.ads.findMany({
      where: eq(ads.isActive, true),
    });

    return NextResponse.json(adverts);
  } catch (error) {
    console.error('Error fetching ads:', error);
    return NextResponse.json({ error: 'Failed to fetch ads' }, { status: 500 });
  }
}
