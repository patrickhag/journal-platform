import { auth } from '@/auth';
import { db } from '@/db/db';
import { users, userRoles } from '@/db/schema';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (
      !(session?.user.role === 'ADMIN' || session?.user.role === 'CHIEF_EDITOR')
    ) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const allUserRoles = await db.query.userRoles.findMany({
      columns: {
        role: true,
      },
      with: {
        user: {
          columns: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
            email: true,
            affiliation: true,
            createdAt: true,
            isPartOfEditorialBoard: true,
          },
        },
      },
    });

    // Group users by ID and collect all roles
    const usersMap = new Map();

    allUserRoles.forEach((userRole) => {
      const userId = userRole.user.id;
      if (!usersMap.has(userId)) {
        usersMap.set(userId, {
          ...userRole.user,
          roles: [],
        });
      }
      usersMap.get(userId).roles.push(userRole.role);
    });

    // Transform to array format with primary role for backward compatibility
    const usersWithRoles = Array.from(usersMap.values()).map((user) => ({
      ...user,
      role: user.roles[0] || '', // Primary role for backward compatibility
    }));

    return NextResponse.json(usersWithRoles);
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
