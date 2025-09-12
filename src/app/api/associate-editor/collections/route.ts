import { auth } from '@/auth';
import { db } from '@/db/db';
import {
  associateEditorAssignments,
  associateEditorCorrections,
} from '@/db/schema';
import { informStaffEditorAboutCorrection } from '@/lib/emailTransporter';
import { and, eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const session = await auth();

    if (
      !(session?.user.role !== 'CHIEF_EDITOR') ||
      session?.user.role !== 'STAFF_EDITOR'
    ) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const assignedArticles = await db.query.associateEditorAssignments.findMany(
      {
        where: and(
          eq(associateEditorAssignments.userId, session?.user.id as string),
          eq(associateEditorAssignments.status, 'ACCEPTED')
        ),
        columns: {
          id: true,
          assignedAt: true,
          dueDate: true,
          fileIds: true,
          message: true,
        },
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
              metadata: {
                columns: {
                  title: true,
                },
              },
            },
          },
        },
      }
    );

    return NextResponse.json(assignedArticles);
  } catch (error) {
    console.error('Error querying assigned articles:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
