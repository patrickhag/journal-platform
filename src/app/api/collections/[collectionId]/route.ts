import { auth } from '@/auth';
import { db } from '@/db/db';
import { collections, collectionArticles } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ collectionId: string }> }
) {
  try {
    const session = await auth();

    if (session?.user.role !== 'CHIEF_EDITOR') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { collectionId } = await params;

    const {
      title,
      thumbnailUrl,
      description,
      objective,
      sdgGoal,
      isFeatured,
      removedArticles,
    } = await req.json();

    if (!collectionId) {
      return NextResponse.json(
        { error: 'Collection ID is required' },
        { status: 400 }
      );
    }

    // Remove selected articles from the collection
    if (removedArticles?.length) {
      for (const articleId of removedArticles) {
        await db
          .delete(collectionArticles)
          .where(
            and(
              eq(collectionArticles.collectionId, collectionId),
              eq(collectionArticles.articleId, articleId)
            )
          );
      }
    }

    // Update collection metadata
    const updated = await db
      .update(collections)
      .set({
        title,
        description,
        objective,
        sdgGoal,
        isFeatured,
        thumbnailUrl,
      })
      .where(eq(collections.id, collectionId))
      .returning();

    if (updated.length === 0) {
      return NextResponse.json(
        { error: 'Collection not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Collection updated successfully!' });
  } catch (error) {
    console.error('Error updating collection:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

interface Params {
  collectionId: string;
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

    const { collectionId } = await params;

    if (!collectionId) {
      return NextResponse.json(
        { message: 'Collection ID is required' },
        { status: 400 }
      );
    }

    const deletedCollection = await db
      .delete(collections)
      .where(eq(collections.id, collectionId))
      .returning();

    if (deletedCollection.length === 0) {
      return NextResponse.json(
        { message: 'Collection not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Collection deleted successfully!' });
  } catch (error) {
    console.error('Error deleting collection:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
