import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db/db';
import { editorAssignment } from '@/db/schema';
import { auth } from '@/auth';
import { desc, eq } from 'drizzle-orm';

export async function GET(req: NextRequest) {
  try {
    const session = await auth();

    if (!(session?.user.role === 'STAFF_EDITOR')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const associateEditorsAssigments = await db.query.editorAssignment.findMany(
      {
        where: eq(
          editorAssignment.userId,
          '4c7fed47-9110-41cc-bd5d-e9a0b6b1c9ea'
        ),
        orderBy: desc(editorAssignment.assignedAt),
        columns: {
          id: true,
          assignedAt: true,
        },
        with: {
          articleSubmission: {
            columns: {
              id: true,
              articleStatus: true,
              createdAt: true,
            },
            with: {
              user: {
                columns: {
                  firstName: true,
                  lastName: true,
                },
              },
              metadata: {
                columns: {
                  title: true,
                  prefix: true,
                },
              },
              reviews: {
                columns: { id: true },
              },
            },
          },
        },
      }
    );

    return NextResponse.json(associateEditorsAssigments);
  } catch (error) {
    console.error('Error creating volume:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
