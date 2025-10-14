import { auth } from '@/auth';
import { db } from '@/db/db';
import { associateEditorAssignments } from '@/db/schema';
import { and, desc, eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

type Params = { assignmentId: string };

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<Params> }
) {
  try {
    const session = await auth();

    const { assignmentId } = await params;

    if (session?.user.role !== 'ASSOCIATE_EDITOR') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const assignedArticle = await db.query.associateEditorAssignments.findFirst(
      {
        where: and(eq(associateEditorAssignments.id, assignmentId)),
        columns: {
          id: true,
          dueDate: true,
          message: true,
        },
        orderBy: desc(associateEditorAssignments.assignedAt),
        with: {
          staffEditor: {
            columns: {
              firstName: true,
              lastName: true,
              email: true,
            },
          },
          articleSubmissions: {
            columns: {
              id: true,
              articleStatus: true,
            },
            with: {
              associateEditorCorrections: {
                columns: {
                  fileId: true,
                  submittedAt: true,
                },
              },
              user: {
                columns: {
                  firstName: true,
                  lastName: true,
                },
              },
              metadata: {
                columns: {
                  prefix: true,
                  title: true,
                },
              },
            },
          },
        },
      }
    );

    return NextResponse.json(assignedArticle);
  } catch (error) {
    console.error('Error querying assigned articles:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
