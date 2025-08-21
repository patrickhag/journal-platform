import { auth } from '@/auth';
import { db } from '@/db/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

type Params = { userId: string };

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<Params> }
) {
  try {
    const session = await auth();
    if (
      !(session?.user.role === 'ADMIN' || session?.user.role === 'CHIEF_EDITOR')
    ) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { userId } = await params;

    const foundUserInfo = await db.query.users.findFirst({
      where: eq(users.id, userId),
      with: {
        articles: {
          columns: {
            id: true,
          },
        },
        publishedArticles: {
          columns: {
            id: true,
          },
        },
      },
    });

    return NextResponse.json(foundUserInfo);
  } catch (error) {
    console.error('Error creating volume:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<Params> }
) {
  try {
    const session = await auth();

    if (
      !(session?.user.role === 'CHIEF_EDITOR' || session?.user.role === 'ADMIN')
    ) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { userId } = await params;

    const { isActive, role } = await req.json();

    const isDone = await db
      .update(users)
      .set({
        isActive,
        role,
      })
      .where(eq(users.id, userId))
      .returning();

    if (isDone.length > 0) {
      return NextResponse.json({
        message: 'User info updated successfully!',
      });
    }
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
