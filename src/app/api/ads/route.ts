import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db/db';
import { ads, TNewAd } from '@/db/schema';
import { auth } from '@/auth';
import { eq } from 'drizzle-orm';

export async function GET(req: NextRequest) {
  try {
    const adverts = await db.query.ads.findMany();

    return NextResponse.json(adverts);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch articles' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();

    const isAdvertExist = await db.query.ads.findFirst({
      where: eq(ads.title, body.title),
    });

    if (isAdvertExist) {
      return NextResponse.json(
        { message: 'Advert already exists' },
        { status: 409 }
      );
    }

    const adData: TNewAd = {
      title: body.title,
      imageUrl: body.fileId,
      linkUrl: body.linkUrl,
      startDate: body.startDate,
      endDate: body.endDate,
      isActive: body.isActive,
    };

    await db.insert(ads).values(adData);

    return NextResponse.json(
      {
        message: 'Advert created successfully!',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error inserting ad:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
