import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db/db';
import { feedbacks } from '@/db/schema';
import { auth } from '@/auth';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    await db.insert(feedbacks).values(body).returning();

    return NextResponse.json(
      {
        message: 'Thank you for submitting your feedback!',
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error creating feedback:', error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    } else {
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await auth();

    if (
      !(session?.user.role === 'ADMIN' || session?.user.role === 'CHIEF_EDITOR')
    ) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const allFeedbacks = await db.query.feedbacks.findMany();

    return NextResponse.json(allFeedbacks);
  } catch (error) {
    console.error('Error creating volume:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
