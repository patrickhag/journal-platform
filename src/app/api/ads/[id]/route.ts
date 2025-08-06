// /api/ads/[id]/route.ts

import { db } from '@/db/db';
import { ads } from '@/db/schema';
import { NextRequest, NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { auth } from '@/auth';
import { z } from 'zod';

type Params = { id: string };

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<Params> }
) {
  try {
    const session = await auth();

    if (session?.user.role !== 'CHIEF_EDITOR') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const { title, imageUrl, startDate, endDate, isActive, linkUrl } =
      await req.json();

    const updated = await db
      .update(ads)
      .set({
        title: title,
        imageUrl: imageUrl,
        linkUrl: linkUrl,
        startDate: startDate,
        endDate: endDate,
        isActive: isActive,
      })
      .where(eq(ads.id, id))
      .returning();

    return NextResponse.json({
      message: 'Advert updated successfully!',
      advert: updated[0],
    });
  } catch (error) {
    console.error('Error updating advert:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<Params> }
) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json({ error: 'Missing advert ID' }, { status: 400 });
    }

    const deleted = await db.delete(ads).where(eq(ads.id, id));

    return NextResponse.json({ message: 'Advert deleted succefully' });
  } catch (error) {
    console.error('[AD_DELETE_ERROR]', error);
    return NextResponse.json(
      { error: 'Failed to delete advert' },
      { status: 500 }
    );
  }
}
