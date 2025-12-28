import { auth } from '@/auth';
import { db } from '@/db/db';
import { associateEditorAssignments } from '@/db/schema';
import { and, eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const session = await auth();

    if (session?.user.role !== 'ASSOCIATE_EDITOR') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const finalizedAssignments =
      await db.query.associateEditorAssignments.findMany({
        where: and(
          eq(associateEditorAssignments.userId, session?.user.id as string),
          eq(associateEditorAssignments.status, 'FINALIZED')
        ),
        columns: {
          id: true,
          assignedAt: true,
          dueDate: true,
          message: true,
          status: true,
        },
        with: {
          articleSubmissions: {
            columns: {
              id: true,
              articleStatus: true,
            },
            with: {
              metadata: {
                columns: {
                  title: true,
                },
              },
            },
          },
        },
      });

    return NextResponse.json(finalizedAssignments);
  } catch (error) {
    console.error('Error querying finalized assignments:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
