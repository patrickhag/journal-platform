import { auth } from '@/auth';
import { db } from '@/db/db';
import {
  associateEditorAssignments,
  associateEditorCorrections,
} from '@/db/schema';
import { notifyAssociateEditor } from '@/lib/emailTransporter';
import { and, eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

type Params = { correctionId: string };

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<Params> }
) {
  try {
    const session = await auth();

    if (
      !(
        session?.user.role === 'CHIEF_EDITOR' ||
        session?.user.role === 'STAFF_EDITOR'
      )
    ) {
      return NextResponse.json(
        { error: 'Unauthorized access' },
        { status: 401 }
      );
    }

    const { correctionId } = await params;

    const { status, note } = await req.json();

    const articleInfo = await db.query.associateEditorCorrections.findFirst({
      where: eq(associateEditorCorrections.id, correctionId),
      with: {
        user: {
          columns: {
            id: true,
            prefix: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        article: {
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

    const associateEditorName = `${articleInfo?.user.prefix ?? ''} ${articleInfo?.user.firstName} ${articleInfo?.user.lastName}`;
    const associateEditorEmail = articleInfo?.user.email;
    const associateEditorId = articleInfo?.user.id;
    const articleTitle = articleInfo?.article?.metadata.title;
    const articleLink = articleInfo?.article?.id;

    await db
      .update(associateEditorCorrections)
      .set({ status })
      .where(eq(associateEditorCorrections.id, correctionId));

    await db
      .update(associateEditorAssignments)
      .set({ status: 'FINALIZED' })
      .where(
        and(
          eq(associateEditorAssignments.userId, associateEditorId as string),
          eq(associateEditorAssignments.articleId, articleLink as string)
        )
      );

    await notifyAssociateEditor({
      associateEditorEmail: associateEditorEmail as string,
      associateEditorName: associateEditorName as string,
      articleTitle: articleTitle as string,
      articleId: articleLink as string,
      status,
      message: note,
    });

    return NextResponse.json({
      message: 'Associate-editor has been informed!',
    });
  } catch (error) {
    console.error('Error informing associate-editor:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
