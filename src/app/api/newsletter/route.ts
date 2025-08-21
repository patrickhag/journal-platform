import { db, newsletterSubscribers } from '@/db/schema';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email } = body;

    await db
      .insert(newsletterSubscribers)
      .values({
        email,
      })
      .returning();

    return NextResponse.json(
      { message: 'Issue created successfully' },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error creating issue:', error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    } else {
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  }
}
