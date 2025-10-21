import { auth } from '@/auth';
import { db } from '@/db/db';
import {
  associateEditorAssignments,
  associateEditorCorrections,
} from '@/db/schema';
import { informStaffEditorAboutCorrection } from '@/lib/emailTransporter';
import { and, desc, eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const session = await auth();

    if (session?.user.role !== 'ASSOCIATE_EDITOR') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const assignedArticles = await db.query.associateEditorAssignments.findMany(
      {
        where: and(
          eq(associateEditorAssignments.userId, session?.user.id as string),
          eq(associateEditorAssignments.status, 'ACCEPTED')
        ),
        orderBy: desc(associateEditorAssignments.assignedAt),
        columns: {
          id: true,
          assignedAt: true,
          dueDate: true,
          message: true,
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

export async function POST(req: Request) {
  try {
    const {
      articleId,
      fileId,
      staffEditorName,
      articleTitle,
      staffEditorEmail,
    } = await req.json();

    const session = await auth();

    const associateEditorName = session?.user.name;

    if (session?.user.role !== 'ASSOCIATE_EDITOR') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await db.insert(associateEditorCorrections).values({
      articleId,
      fileId,
      userId: session?.user.id,
    });

    // send email to staff-editor
    await informStaffEditorAboutCorrection({
      staffEditorEmail,
      articleTitle,
      staffEditorName,
      associateEditorName: associateEditorName as string,
    });

    return NextResponse.json(
      {
        message:
          'Editted file sent successfully and staff-editor was informed.',
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Something went wrong', details: error },
      { status: 400 }
    );
  }
}
