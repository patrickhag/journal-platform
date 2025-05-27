import { auth } from '@/auth';
import { db } from '@/db/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (
      !(session?.user.role === 'ADMIN' || session?.user.role === 'CHIEF_EDITOR')
    ) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const users = await db.query.users.findMany();

    return NextResponse.json({ users });
  } catch (error) {
    console.error('Error creating volume:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    // const session = await auth();

    // if (session?.user.role !== 'CHIEF_EDITOR') {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    const { userId, isActive, role } = await req.json();

    if (!userId) {
      return NextResponse.json(
        { message: 'User ID is required' },
        { status: 400 }
      );
    }

    const isDone = await db
      .update(users)
      .set({
        isActive: !isActive,
        role,
      })
      .where(eq(users.id, userId))
      .returning();

    if (isDone.length > 0) {
      revalidatePath('/editor/users');
      return NextResponse.json({
        message: 'User updated successfully!',
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
