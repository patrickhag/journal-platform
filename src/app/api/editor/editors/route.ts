import { auth } from '@/auth';
import { db } from '@/db/db';
import { articleSubmissions, editors, userRoles, users } from '@/db/schema';
import { notifyAssociateEditor } from '@/lib/emailTransporter';
import { eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (
      !(session?.user.role === 'ADMIN' || session?.user.role === 'CHIEF_EDITOR')
    ) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const associateEditors = await db.query.users.findMany({
      with: {
        roles: {
          where: eq(userRoles.role, 'ASSOCIATE_EDITOR'),
        },
      },
    });

    const associateEditorUsers = associateEditors.filter(
      (user) => user.roles.length > 0
    );

    return NextResponse.json(associateEditorUsers);
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

    const extractractedEditorId = await db
      .insert(editors)
      .values({
        userId,
      })
      .returning({ editorId: editors.id });

    await db
      .update(articleSubmissions)
      .set({ editorId: extractractedEditorId[0].editorId })
      .where(eq(articleSubmissions.id, articleId));

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

    const isEditorInformed = await notifyAssociateEditor({
      articleTitle: article?.metadata.title as string,
      authorNames: article?.user.firstName + ' ' + article?.user.lastName,
      editorName,
      associateEditorEmail: editorEmail,
    });

    if (isEditorInformed.success) {
      return NextResponse.json(
        {
          message: 'Associate editor assigned and informed successfully',
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
