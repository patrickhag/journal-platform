import { auth } from '@/auth';
import { db } from '@/db/db';
import { userRoles } from '@/db/schema';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const session = await auth();

    if (
      !(session?.user.role === 'ADMIN' || session?.user.role === 'CHIEF_EDITOR')
    ) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get all users with their roles
    const allUserRoles = await db.query.userRoles.findMany({
      with: {
        user: {
          columns: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            affiliation: true,
          },
        },
      },
    });

    // Group users by userId and collect their roles
    const usersWithRoles = new Map<
      string,
      {
        id: string;
        firstName: string | null;
        lastName: string | null;
        email: string | null;
        affiliation: string | null;
        roles: string[];
      }
    >();

    allUserRoles.forEach((userRole) => {
      const userId = userRole.user.id;
      if (!usersWithRoles.has(userId)) {
        usersWithRoles.set(userId, {
          id: userRole.user.id,
          firstName: userRole.user.firstName,
          lastName: userRole.user.lastName,
          email: userRole.user.email,
          affiliation: userRole.user.affiliation,
          roles: [userRole.role],
        });
      } else {
        const user = usersWithRoles.get(userId)!;
        if (!user.roles.includes(userRole.role)) {
          user.roles.push(userRole.role);
        }
      }
    });

    // Filter out users who have AUTHOR or CHIEF_EDITOR as any role
    const eligibleUsers = Array.from(usersWithRoles.values()).filter(
      (user) =>
        !user.roles.includes('NORMAL_USER') &&
        !user.roles.includes('CHIEF_EDITOR')
    );

    // Format for frontend (include primary role)
    const formattedUsers = eligibleUsers.map((user) => ({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      affiliation: user.affiliation,
      role: user.roles[0], // Primary role (first one)
    }));

    return NextResponse.json(formattedUsers, { status: 200 });
  } catch (error) {
    console.error('Error fetching eligible users:', error);
    return NextResponse.json(
      { error: 'Failed to load eligible users' },
      { status: 500 }
    );
  }
}
