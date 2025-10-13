import { db } from '@/db/db';
import { finalSubmissions } from '@/db/schema';
import { NextRequest, NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';

type Params = { articleId: string };

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<Params> }
) {
  try {
    const { articleId } = await params;

    console.log('articleId:', articleId);

    const result = await db.query.finalSubmissions.findFirst({
      where: eq(finalSubmissions.articleId, articleId),
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error getting final-submissions:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
