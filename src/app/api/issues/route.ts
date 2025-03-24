import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db/db';
import { articleSubmissions, Issues, issues } from '@/db/schema';
import { auth } from '@/auth';
import { eq } from 'drizzle-orm';

export async function GET(_req: NextRequest) {
  try {
    const session = await auth();

    if (session?.user.role !== 'CHIEF_EDITOR') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await db.query.issues.findMany({
      columns: {
        id: true,
        title: true,
        description: true,
        status: true,
        issueNumber: true,
        volumeId: true,
      },
      with: {
        volume: {
          columns: {
            id: true,
            volumeNumber: true,
          },
        },
        articles: {
          columns: {
            id: true,
            section: true,
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
        },
      },
    });

    return NextResponse.json(data);
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
      issueNumber,
      volumeId,
      title,
      description,
      publicationDate,
      status,
    } = body as Issues;

    const session = await auth();

    if (session?.user.role !== 'CHIEF_EDITOR') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!issueNumber || !volumeId || !publicationDate) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    await db
      .insert(issues)
      .values({
        issueNumber,
        volumeId,
        title,
        description,
        publicationDate,
        status,
      })
      .returning();

    return NextResponse.json(
      { message: 'Issue created successfully' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating issue:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await auth();

    if (session?.user.role !== 'CHIEF_EDITOR') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { issueId, articleIds } = await req.json();

    if (!issueId || !Array.isArray(articleIds) || articleIds.length === 0) {
      return NextResponse.json(
        { message: 'Invalid issueId or articleIds' },
        { status: 400 }
      );
    }

    for (const articleId of articleIds) {
      const articles = await db.query.articleSubmissions.findMany({
        where: eq(articleSubmissions.id, articleId),
      });

      if (!articles.every((a) => a.articleStatus === 'Accepted')) {
        return NextResponse.json(
          { message: 'All articles must have Accepted status' },
          { status: 400 }
        );
      }
      await db
        .update(articleSubmissions)
        .set({ issueId })
        .where(eq(articleSubmissions.id, articleId));
    }
    return NextResponse.json(
      { message: 'Articles successfully assigned to the issue' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating articles:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
