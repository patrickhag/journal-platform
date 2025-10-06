import { auth } from '@/auth';
import { db } from '@/db/db';
import { userRoles, users } from '@/db/schema';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { names, prefix, affiliation, email, expertise } = body;

    const session = await auth();

    if (
      !(
        session?.user.role === 'CHIEF_EDITOR' ||
        session?.user.role === 'STAFF_EDITOR'
      )
    ) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const namesParts = names.split(' ');
    const firstName = namesParts[0];
    const lastName = namesParts[1];

    const newUser = await db
      .insert(users)
      .values({
        firstName,
        lastName,
        email,
        expertise,
        affiliation,
        prefix,
      })
      .returning({ id: users.id });

    await db.insert(userRoles).values({
      userId: newUser[0].id,
      role: 'REVIEWER',
    });

    return NextResponse.json(
      { message: 'Reviewer created successfully' },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error creating reviewer:', error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    } else {
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  }
}
