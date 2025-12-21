import { auth } from '@/auth';
import { db } from '@/db/db';
import { userRoles } from '@/db/schema';
import { and, eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

type Params = { userId: string };

// POST - Add a role to a user
export async function POST(
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
    const { role } = await req.json();

    if (!role) {
      return NextResponse.json({ error: 'Role is required' }, { status: 400 });
    }

    // Check if the role already exists for this user
    const existingRole = await db.query.userRoles.findFirst({
      where: and(eq(userRoles.userId, userId), eq(userRoles.role, role)),
    });

    if (existingRole) {
      return NextResponse.json(
        { error: 'User already has this role' },
        { status: 400 }
      );
    }

    // Add the new role
    const newRole = await db
      .insert(userRoles)
      .values({
        userId,
        role,
      })
      .returning();

    return NextResponse.json({
      message: 'Role added successfully!',
      role: newRole[0],
    });
  } catch (error) {
    console.error('Error adding role:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE - Remove a role from a user
export async function DELETE(
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
    const { searchParams } = new URL(req.url);
    const role = searchParams.get('role');

    if (!role) {
      return NextResponse.json(
        { error: 'Role parameter is required' },
        { status: 400 }
      );
    }

    // Check if the role exists for this user
    const existingRole = await db.query.userRoles.findFirst({
      where: and(eq(userRoles.userId, userId), eq(userRoles.role, role)),
    });

    if (!existingRole) {
      return NextResponse.json(
        { error: 'User does not have this role' },
        { status: 404 }
      );
    }

    // Get all roles for this user
    const allRoles = await db.query.userRoles.findMany({
      where: eq(userRoles.userId, userId),
    });

    // Prevent removing the last role
    if (allRoles.length <= 1) {
      return NextResponse.json(
        { error: 'Cannot remove the last role from a user' },
        { status: 400 }
      );
    }

    // Remove the role
    await db
      .delete(userRoles)
      .where(and(eq(userRoles.userId, userId), eq(userRoles.role, role)));

    return NextResponse.json({
      message: 'Role removed successfully!',
    });
  } catch (error) {
    console.error('Error removing role:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
