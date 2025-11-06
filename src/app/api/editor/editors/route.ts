import { auth } from '@/auth';
import { db } from '@/db/db';
import { articleSubmissions, editorAssignment, userRoles } from '@/db/schema';
import { notifyStaffEditor } from '@/lib/emailTransporter';
import { and, eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (session?.user.role !== 'CHIEF_EDITOR') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const staffEditorUsers = await db.query.userRoles.findMany({
      where: eq(userRoles.role, 'STAFF_EDITOR'),
      with: {
        user: {
          columns: {
            id: true,
            firstName: true,
            lastName: true,
            orcid: true,
            expertise: true,
            country: true,
            affiliation: true,
            bio: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json(staffEditorUsers);
  } catch (error) {
    console.error('Error creating volume:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, articleId, editorName, editorEmail } = body;

    const session = await auth();

    if (
      !(session?.user.role === 'ADMIN' || session?.user.role === 'CHIEF_EDITOR')
    ) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // check if the editor is already assigned to the article
    const isEditorAlreadyAssigned = await db.query.editorAssignment.findFirst({
      where: and(
        eq(editorAssignment.userId, userId),
        eq(editorAssignment.articleId, articleId)
      ),
    });

    if (isEditorAlreadyAssigned) {
      return NextResponse.json(
        { message: 'Editor has already been assigned to this article.' },
        { status: 409 }
      );
    }

    await db
      .insert(editorAssignment)
      .values({
        userId,
        articleId,
      })
      .returning({ editorId: editorAssignment.id });

    const article = await db.query.articleSubmissions.findFirst({
      columns: {
        id: true,
      },
      with: {
        metadata: {
          columns: {
            title: true,
          },
        },
        user: {
          columns: {
            firstName: true,
            lastName: true,
          },
        },
      },
      where: eq(articleSubmissions.id, articleId),
    });

    const isEditorInformed = await notifyStaffEditor({
      articleTitle: article?.metadata.title as string,
      authorNames: article?.user.firstName + ' ' + article?.user.lastName,
      editorName,
      staffEditorEmail: editorEmail,
    });

    if (isEditorInformed.success) {
      return NextResponse.json(
        {
          message: 'Staff editor assigned and informed successfully',
        },
        { status: 201 }
      );
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error assigning editor:', error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    } else {
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  }
}
