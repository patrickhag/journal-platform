import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db/db';
import {
  articleSubmissions,
  editorAssignment,
  metadata,
  reviews,
  users,
} from '@/db/schema';
import { auth } from '@/auth';
import { and, desc, eq } from 'drizzle-orm';

export async function GET(req: NextRequest) {
  try {
    const session = await auth();

    if (!(session?.user.role === 'STAFF_EDITOR')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const articleStatus = searchParams.get('articleStatus');

    const staffEditorsAssigments = await db
      .select({
        id: editorAssignment.id,
        assignedAt: editorAssignment.assignedAt,
        articleId: articleSubmissions.id,
        articleStatus: articleSubmissions.articleStatus,
        createdAt: articleSubmissions.createdAt,
        firstName: users.firstName,
        lastName: users.lastName,
        title: metadata.title,
        prefix: metadata.prefix,
      })
      .from(editorAssignment)
      .innerJoin(
        articleSubmissions,
        eq(editorAssignment.articleId, articleSubmissions.id)
      )
      .innerJoin(users, eq(articleSubmissions.userId, users.id))
      .innerJoin(metadata, eq(articleSubmissions.id, metadata.articleId))
      .where(
        and(
          eq(editorAssignment.userId, session.user.id as string),
          articleStatus
            ? eq(articleSubmissions.articleStatus, articleStatus)
            : undefined
        )
      )
      .orderBy(desc(editorAssignment.assignedAt));

    const formattedAssignments = staffEditorsAssigments.map((assignment) => ({
      id: assignment.id,
      assignedAt: assignment.assignedAt,
      articleSubmission: {
        id: assignment.articleId,
        articleStatus: assignment.articleStatus,
        createdAt: assignment.createdAt,
        user: {
          firstName: assignment.firstName,
          lastName: assignment.lastName,
        },
        metadata: {
          title: assignment.title,
          prefix: assignment.prefix,
        },
      },
    }));

    return NextResponse.json(formattedAssignments);
  } catch (error) {
    console.error('Error creating volume:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
