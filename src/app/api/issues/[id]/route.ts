import { db } from '@/db/db';
import {
  issues,
  articleSubmissions as articles,
  articleSubmissions,
} from '@/db/schema';
import { NextRequest, NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { auth } from '@/auth';

type Params = { id: string };

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<Params> }
) {
  try {
    const session = await auth();

    if (session?.user.role !== 'CHIEF_EDITOR') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { articleIds } = await req.json();
    const { id: issueId } = await params;

    if (!articleIds || !issueId) {
      return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
    }

    // Update issue status to Published
    await db
      .update(issues)
      .set({ status: 'Published' })
      .where(eq(issues.id, issueId));

    // Update articles status to Published
    for (const articleId of articleIds) {
      await db
        .update(articles)
        .set({ articleStatus: 'Published' })
        .where(eq(articles.id, articleId));
    }

    return NextResponse.json({ message: 'Issue published successfully!' });
  } catch (error) {
    console.error('Error publishing issue:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<Params> }
) {
  try {
    const session = await auth();

    if (session?.user.role !== 'CHIEF_EDITOR') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: issueId } = await params;

    if (!issueId) {
      return NextResponse.json(
        { message: 'Issue ID is required' },
        { status: 400 }
      );
    }

    const isIssueDeleted = await db
      .delete(issues)
      .where(eq(issues.id, issueId))
      .returning();

    if (isIssueDeleted.length === 0) {
      return NextResponse.json({ message: 'Issue not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Issue deleted successfully!' });
  } catch (error) {
    console.error('Error deleting issue:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<Params> }
) {
  try {
    const session = await auth();

    if (session?.user.role !== 'CHIEF_EDITOR') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: issueId } = await params;

    /* 
    {
    "issueNumber": 1,
    "volumeId": "2692056a-1f4a-45d7-bf53-7b25dfc788ce",
    "title": "Issue 1 - Special Edition",
    "description": "This issue focuses on global health trends.",
    "publicationDate": "2025-06-15T00:00:00.000Z",
    "status": "Draft",
    "removedArticles": []
}
    
    */

    const {
      issueNumber,
      volumeId,
      title,
      description,
      publicationDate,
      status,
      removedArticles,
    } = await req.json();

    if (!issueId) {
      return NextResponse.json(
        { error: 'Issue ID is required' },
        { status: 400 }
      );
    }

    if (removedArticles) {
      for (const article of removedArticles) {
        await db
          .update(articleSubmissions)
          .set({ issueId: null })
          .where(eq(articles.id, article));
      }
    }

    const updatedIssue = await db
      .update(issues)
      .set({
        issueNumber,
        volumeId,
        title,
        description,
        publicationDate,
        status,
      })
      .where(eq(issues.id, issueId))
      .returning();

    if (updatedIssue.length === 0) {
      return NextResponse.json({ error: 'Issue not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Issue updated succeccfully!' });
  } catch (error) {
    console.error('Error updating issue:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
