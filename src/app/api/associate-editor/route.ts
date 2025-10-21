import { auth } from '@/auth';
import { db } from '@/db/db';
import {
  articleSubmissions,
  associateEditorAssignments,
  userRoles,
} from '@/db/schema';
import { sendAssociateEditorInvitation } from '@/lib/emailTransporter';
import { and, eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';
import { format } from 'date-fns';

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
            bio: true,
          },
        },
      },
    });

    return NextResponse.json(associateEditors);
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
    const {
      articleId,
      editorName,
      editorEmail,
      date,
      userId,
      articleTitle,
      staffEditorId,
      message,
    } = body;

    const session = await auth();

    if (
      !(
        session?.user.role === 'CHIEF_EDITOR' ||
        session?.user.role === 'STAFF_EDITOR'
      )
    ) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const isEditorAlreadyAssigned =
      await db.query.associateEditorAssignments.findFirst({
        where: and(
          eq(associateEditorAssignments.userId, userId),
          eq(associateEditorAssignments.articleId, articleId)
        ),
      });

    if (isEditorAlreadyAssigned) {
      return NextResponse.json(
        {
          message: 'Associate editor has already been assigned to this article',
        },
        { status: 409 }
      );
    }

    await db.insert(associateEditorAssignments).values({
      articleId,
      userId,
      dueDate: new Date(date),
      status: 'INVITED',
      staffEditorId,
      message,
    });

    // UPDATE ARTICLE STATUS TO `UNDER PRESS` AND ADD THE `ACCEPTED AT` DATE
    await db
      .update(articleSubmissions)
      .set({
        articleStatus: 'UNDER PRESS',
        acceptedAt: new Date().toISOString().split('T')[0],
      })
      .where(eq(articleSubmissions.id, articleId));

    // send email to editor
    await sendAssociateEditorInvitation({
      editorName: editorName,
      articleTitle: articleTitle,
      dueDate: format(new Date(date as string), 'MMMM d, yyyy'),
      articleId: articleId,
      editorEmail: editorEmail,
    });

    return NextResponse.json(
      {
        message: 'Associate editor assigned and informed successfully',
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error assigning editor:', error.message);
      return NextResponse.json(
        { message: 'Something went wrong' },
        { status: 500 }
      );
    } else {
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  }
}

export async function PATCH(req: NextRequest) {
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

    const { userId, articleId } = await req.json();

    if (!(userId || articleId)) {
      return NextResponse.json(
        { message: 'Invalid userId or articleId' },
        { status: 400 }
      );
    }

    const isItDeleted = await db
      .delete(associateEditorAssignments)
      .where(
        and(
          eq(associateEditorAssignments.articleId, articleId),
          eq(associateEditorAssignments.userId, userId)
        )
      )
      .returning();

    if (isItDeleted.length > 0) {
      return NextResponse.json(
        { message: 'Associate editor successfully unassigned' },
        { status: 200 }
      );
    }
  } catch (error) {
    console.error('Error updating articles:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
