import { auth } from '@/auth';
import { db } from '@/db/db';
import { associateEditorCorrections } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

type Params = { articleId: string };

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<Params> }
) {
  try {
    const session = await auth();

    const { articleId } = await params;

    if (
      !(session?.user.role !== 'CHIEF_EDITOR') ||
      session?.user.role !== 'STAFF_EDITOR'
    ) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const associateCollections =
      await db.query.associateEditorCorrections.findMany({
        where: eq(associateEditorCorrections.articleId, articleId),
        columns: {
          id: true,
          submittedAt: true,
          fileIds: true,
        },
        with: {
          user: {
            columns: {
              firstName: true,
              lastName: true,
            },
          },
        },
      });

    return NextResponse.json(associateCollections);
  } catch (error) {
    console.error('Error querying assigned articles:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
