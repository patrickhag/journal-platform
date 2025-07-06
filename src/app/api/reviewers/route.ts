import { auth } from '@/auth';
import { db } from '@/db/db';
import {
  articleSubmissions,
  editors,
  reviewAssignments,
  users,
} from '@/db/schema';
import { associateNotifyReviewer } from '@/lib/emailTransporter';
import { eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (
      !(
        session?.user.role === 'CHIEF_EDITOR' ||
        session?.user.role === 'ASSOCIATE_EDITOR'
      )
    ) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const reviewers = await db.query.users.findMany({
      where: eq(users.role, 'REVIEWER'),
    });

    return NextResponse.json(reviewers);
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
    const { articleId, reviewerName, reviewerEmail, date, userId } = body;

    const session = await auth();

    if (
      !(
        session?.user.role === 'CHIEF_EDITOR' ||
        session?.user.role === 'ASSOCIATE_EDITOR'
      )
    ) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await db.insert(reviewAssignments).values({
      articleId,
      userId,
      dueDate: date,
    });

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

    await associateNotifyReviewer({
      articleTitle: article?.metadata.title as string,
      authorNames: article?.user.firstName + ' ' + article?.user.lastName,
      reviewerEmail: reviewerEmail,
      reviewerNames: reviewerName,
    });

    return NextResponse.json(
      {
        message: 'Reviewer assigned and informed successfully',
      },
      { status: 201 }
    );
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
