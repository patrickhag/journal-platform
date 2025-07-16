import { auth } from '@/auth';
import { db, notifications } from '@/db/schema';
import { and, eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const session = await auth();

  try {
    const notificationsData = await db
      .select()
      .from(notifications)
      .where(
        and(
          eq(notifications.userId, session?.user?.id || ''),
          eq(notifications.isRead, false)
        )
      );

    return NextResponse.json(notificationsData);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch manual' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const { userId } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
    }

    await db
      .update(notifications)
      .set({ isRead: true })
      .where(eq(notifications.userId, userId));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[mark-all-as-read] Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
