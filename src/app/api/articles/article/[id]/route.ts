import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db/db';
import { articleSubmissions } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { auth } from '@/auth';

type Params = {
  id: string;
};

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<Params> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: 'Missing article ID' },
        { status: 400 }
      );
    }

    const article = await db.query.articleSubmissions.findFirst({
      where: eq(articleSubmissions.id, id),
      with: {
        user: {
          columns: {
            id: true,
          },
        },
      },
    });

    const session = await auth();

    if (!session || session?.user.id !== article?.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!article) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    }

    await db.delete(articleSubmissions).where(eq(articleSubmissions.id, id));

    return NextResponse.json(
      { message: 'Article deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting article:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
