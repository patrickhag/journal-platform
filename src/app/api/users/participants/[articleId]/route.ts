import { auth } from '@/auth';
import { db } from '@/db/db';
import { articleSubmissions } from '@/db/schema';
import { Params } from '@/types';
import { eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<Params> }
) {
  try {
    const { articleId } = await params;
    const session = await auth();
    if (
      !(
        session?.user.role === 'CHIEF_EDITOR' ||
        session?.user.role === 'STAFF_EDITOR'
      )
    ) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const participants = await db.query.articleSubmissions.findFirst({
      where: eq(articleSubmissions.id, articleId),
      columns: {
        id: true,
      },
      with: {
        editorAssignment: {
          columns: { id: true },
          with: {
            user: {
              columns: {
                firstName: true,
                lastName: true,
                prefix: true,
                expertise: true,
              },
            },
          },
        },
        reviewAssignments: {
          columns: { id: true, status: true },
          with: {
            user: {
              columns: {
                firstName: true,
                lastName: true,
                prefix: true,
                expertise: true,
              },
            },
          },
        },
        associateEditorAssignments: {
          columns: { id: true, status: true },
          with: {
            user: {
              columns: {
                firstName: true,
                lastName: true,
                prefix: true,
                expertise: true,
              },
            },
          },
        },
      },
    });

    // Grab the reviewers from reviewAssignments who have accepted the invitation
    const reviewers = participants?.reviewAssignments
      ? participants.reviewAssignments.filter(
          (assignment) => assignment.status === 'ACCEPTED'
        )
      : [];

    const associateEditors = participants?.associateEditorAssignments
      ? participants.associateEditorAssignments.filter(
          (assignment) => assignment.status === 'ACCEPTED'
        )
      : [];

    const staffEditor = participants?.editorAssignment?.user || null;

    return NextResponse.json({ staffEditor, reviewers, associateEditors });
  } catch (error) {
    console.error('Error creating volume:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
