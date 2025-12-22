import { auth } from '@/auth';
import { db } from '@/db/db';
import { eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';
import { userRoles } from '@/db/schema';

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (
      !(
        session?.user.role === 'CHIEF_EDITOR' ||
        session?.user.role === 'STAFF_EDITOR'
      )
    ) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const associateEditors = await db.query.userRoles.findMany({
      where: eq(userRoles.role, 'ASSOCIATE_EDITOR'),
      columns: {
        id: true,
      },
      with: {
        user: {
          columns: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            affiliation: true,
            expertise: true,
            prefix: true,
          },
          with: {
            associateEditorAssignments: {
              columns: {
                id: true,
                articleId: true,
                assignedAt: true,
                dueDate: true,
              },
              with: {
                articleSubmissions: {
                  columns: {
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
            },
          },
        },
      },
    });

    // Filter to only include assignments with articles that have 'UNDER PRESS' status
    const filteredAssociateEditors = associateEditors.map((editor) => ({
      ...editor,
      user: {
        ...editor.user,
        associateEditorAssignments:
          editor.user.associateEditorAssignments.filter(
            (assignment) =>
              assignment.articleSubmissions?.articleStatus === 'UNDER PRESS'
          ),
      },
    }));

    return NextResponse.json(filteredAssociateEditors);
  } catch (error) {
    console.error('Error creating volume:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
