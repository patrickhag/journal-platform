import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db/db';
import { articleSubmissions, editors, Issues, issues } from '@/db/schema';
import { auth } from '@/auth';
import { and, eq } from 'drizzle-orm';

export async function GET(req: NextRequest) {
  try {
    const session = await auth();

    const editorId = session?.user.id;

    if (!(session?.user.role === 'ASSOCIATE_EDITOR')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const associateEditorsAssigments = await db.query.editors.findMany({
      columns: {
        id: true,
        assignedAt: true,
      },
      where: eq(editors.userId, editorId as string),
      with: {
        articleSubmissions: {
          columns: {
            id: true,
            articleStatus: true,
            createdAt: true,
          },
          with: {
            user: {
              columns: {
                firstName: true,
                lastName: true,
              },
            },
            metadata: {
              columns: {
                title: true,
                prefix: true,
              },
            },
            reviews: {
              columns: {
                id: true,
              },
            },
          },
        },
      },
    });
    return NextResponse.json(associateEditorsAssigments);
  } catch (error) {
    console.error('Error creating volume:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
