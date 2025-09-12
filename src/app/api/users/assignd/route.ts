import { db } from '@/db/db';
import { associateEditorAssignments } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const foundArticle = await db.query.associateEditorAssignments.findFirst({
      where: eq(
        associateEditorAssignments.articleId,
        '3e598b01-09d8-45a6-8a36-d3474ec5ba81'
      ),
      with: {
        user: {
          columns: {
            firstName: true,
            lastName: true,
          },
        },
        staffEditor: {
          columns: {
            email: true,
          },
        },
        articleSubmissions: {
          columns: {
            id: true,
          },
          with: {
            metadata: {
              columns: {
                title: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json(foundArticle);
  } catch (error) {
    console.error('Error creating volume:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
