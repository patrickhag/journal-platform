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

export async function POST(req: NextRequest) {
  try {
    const session = await auth();

    if (
      !(session?.user.role === 'CHIEF_EDITOR' || session?.user.role === 'ADMIN')
    ) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { userIds } = await req.json();

    const authors: string[] = [];

    for (const userId of userIds) {
      const foundUser = await db.query.userRoles.findFirst({
        columns: {
          role: true,
        },
        with: {
          user: {
            columns: {
              firstName: true,
              lastName: true,
            },
          },
        },
        where: eq(users.id, userId),
      });

      if (!foundUser) continue;

      // Track authors for later
      if (foundUser.role === 'AUTHOR') {
        authors.push(
          `${foundUser?.user.firstName} ${foundUser?.user.lastName}`
        );
        continue; // Skip update
      }

      // Update all other users
      await db
        .update(users)
        .set({ isPartOfEditorialBoard: true })
        .where(eq(users.id, userId));
    }

    // Respond after all updates are done
    if (authors.length > 0) {
      return NextResponse.json(
        {
          message: `⚠️ The following user(s) are AUTHORS and could not be added to the Editorial Board: ${authors.join(
            ', '
          )}. All other eligible users were successfully added.`,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: 'All user(s) successfully added to the Editorial Board!' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
