import { auth } from '@/auth';
import { db } from '@/db/db';
import { collections, collectionArticles, collectionUsers } from '@/db/schema';
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
      userId,
      userIds,
      status,
      deadline,
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
    const updateData: {
      title: string;
      description: string;
      objective: string | null;
      sdgGoal: string;
      isFeatured: boolean;
      thumbnailUrl: string;
      userId?: string;
      status?: string;
      deadline?: Date | null;
    } = {
      title,
      description,
      objective,
      sdgGoal,
      isFeatured,
      thumbnailUrl,
    };

    // Update status if provided
    if (status) {
      updateData.status = status;
    }

    // Update deadline if provided
    if (deadline !== undefined) {
      updateData.deadline = deadline || null;
    }

    // Support both single userId (backward compatibility) and userIds array
    const userIdsToAssign = userIds || (userId ? [userId] : []);

    // Only update userId if it's provided (for backward compatibility)
    if (userId) {
      updateData.userId = userId;
    } else if (userIdsToAssign.length > 0) {
      updateData.userId = userIdsToAssign[0];
    }

    const updated = await db
      .update(collections)
      .set({
        ...updateData,
        deadline: deadline ? new Date(deadline).toISOString() : null,
      })
      .where(eq(collections.id, collectionId))
      .returning();

    if (updated.length === 0) {
      return NextResponse.json(
        { error: 'Collection not found' },
        { status: 404 }
      );
    }

    // Update user assignments if userIds are provided
    if (userIdsToAssign && userIdsToAssign.length > 0) {
      // Delete existing assignments
      await db
        .delete(collectionUsers)
        .where(eq(collectionUsers.collectionId, collectionId));

      // Insert new assignments
      await db.insert(collectionUsers).values(
        userIdsToAssign.map((uid: string) => ({
          collectionId: collectionId,
          userId: uid,
        }))
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
