import { db } from '@/db/db';
import { editorialBoardMembers, users } from '@/db/schema';
import { auth } from '@/auth';
import { eq } from 'drizzle-orm';
import { InferInsertModel } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ memberId: string }> }
) {
  try {
    const { memberId } = await params;

    const member = await db.query.editorialBoardMembers.findFirst({
      where: eq(editorialBoardMembers.id, memberId),
    });

    if (!member) {
      return new NextResponse('Not Found', { status: 404 });
    }

    return NextResponse.json(member);
  } catch (error) {
    console.error('Error fetching editorial board member:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ memberId: string }> }
) {
  try {
    const session = await auth();
    const user = await db.query.users.findFirst({
      where: eq(users.id, session?.user.id as string),
    });

    if (!user || user.role !== 'ADMIN') {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { memberId } = await params;
    const body: Partial<InferInsertModel<typeof editorialBoardMembers>> =
      await req.json();

    const updatedMember = await db
      .update(editorialBoardMembers)
      .set(body)
      .where(eq(editorialBoardMembers.id, memberId))
      .returning();

    if (!updatedMember[0]) {
      return new NextResponse('Not Found', { status: 404 });
    }

    return NextResponse.json(updatedMember[0]);
  } catch (error) {
    console.error('Error updating editorial board member:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ memberId: string }> }
) {
  try {
    const session = await auth();
    const user = await db.query.users.findFirst({
      where: eq(users.id, session?.user.id as string),
    });

    if (!user || user.role !== 'ADMIN') {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { memberId } = await params;

    const deletedMember = await db
      .delete(editorialBoardMembers)
      .where(eq(editorialBoardMembers.id, memberId))
      .returning();

    if (!deletedMember[0]) {
      return new NextResponse('Not Found', { status: 404 });
    }

    return NextResponse.json({
      message: 'Editorial board member deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting editorial board member:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
