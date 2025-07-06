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
