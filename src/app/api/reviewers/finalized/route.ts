import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db/db';
import { reviewAssignments } from '@/db/schema';
import { auth } from '@/auth';
import { and, desc, eq } from 'drizzle-orm';

export async function GET(req: NextRequest) {
  try {
    const session = await auth();

    if (session?.user.role !== 'REVIEWER') {
      return NextResponse.json(
        {
          error:
            'Access denied: Only reviewers are permitted to access this resources.',
        },
        { status: 401 }
      );
    }

    const finalizedAssignments = await db.query.reviewAssignments.findMany({
      columns: {
        id: true,
        status: true,
      },
      orderBy: desc(reviewAssignments.assignedDate),
      where: and(
        eq(reviewAssignments.userId, session.user.id as string),
        eq(reviewAssignments.status, 'FINALIZED')
      ),
      with: {
        article: {
          columns: {
            id: true,
            articleStatus: true,
          },
          with: {
            metadata: {
              columns: {
                title: true,
                prefix: true,
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

    return NextResponse.json(finalizedAssignments);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
