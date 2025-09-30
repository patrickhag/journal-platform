import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db/db';
import { reviewAssignments } from '@/db/schema';
import { desc, eq } from 'drizzle-orm';
import { auth } from '@/auth';

type Params = { assignmentId: string };

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<Params> }
) {
  try {
    const session = await auth();

    const { assignmentId } = await params;

    if (session?.user.role !== 'REVIEWER') {
      return NextResponse.json(
        {
          error:
            'Access denied: Only reviewers are permitted to access this resource.',
        },
        { status: 401 }
      );
    }

    const assignedArticle = await db.query.reviewAssignments.findFirst({
      where: eq(reviewAssignments.id, assignmentId),
      columns: {
        id: true,
        dueDate: true,
      },
      orderBy: desc(reviewAssignments.assignedDate),
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
            files: {
              columns: {
                publicId: true,
                originalName: true,
              },
            },
            user: {
              columns: {
                firstName: true,
                lastName: true,
              },
            },
            reviews: {
              columns: {
                id: true,
                fileIds: true,
                message: true,
                status: true,
                reviewedAt: true,
              },
            },
          },
        },
      },
    });
    return NextResponse.json(assignedArticle);
  } catch (error) {
    console.error('Error fetching particular assignment:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
