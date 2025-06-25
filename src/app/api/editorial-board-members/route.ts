import { db } from '@/db/db';
import { editorialBoardMembers, users } from '@/db/schema';
import { auth } from '@/auth';
import { NextResponse } from 'next/server';
import { eq, InferInsertModel } from 'drizzle-orm';

export async function GET() {
  try {
    const members = await db.query.editorialBoardMembers.findMany();
    return NextResponse.json(members);
  } catch (error) {
    console.error('Error fetching editorial board members:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    const user = await db.query.users.findFirst({
      where: eq(users.id, session?.user.id as string),
    });

    if (!user || user.role !== 'ADMIN') {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const body: InferInsertModel<typeof editorialBoardMembers> =
      await req.json();

    const newMember = await db
      .insert(editorialBoardMembers)
      .values(body)
      .returning();

    return NextResponse.json(newMember[0], { status: 201 });
  } catch (error) {
    console.error('Error creating editorial board member:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
