import { auth } from '@/auth';
import { db } from '@/db/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    // const session = await auth();

    // if (
    //   !(session?.user.role === 'ADMIN' || session?.user.role === 'CHIEF_EDITOR')
    // ) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    const users = await db.query.users.findMany();

    return NextResponse.json({ allUsers: users.length });
  } catch (error) {
    console.error('Error creating volume:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
