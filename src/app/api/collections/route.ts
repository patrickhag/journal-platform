import { auth } from '@/auth';
import { db } from '@/db/db';
import {
  articleSubmissions,
  collectionArticles,
  collections,
  collectionUsers,
} from '@/db/schema';
import { NextRequest, NextResponse } from 'next/server';
import { slugify } from '@/lib/utils';
import { and, eq } from 'drizzle-orm';

export async function GET(req: NextRequest) {
  try {
    const allCollections = await db.query.collections.findMany({
      with: {
        collectionArticles: {
          with: {
            articleSubmission: {
              columns: {
                articleStatus: true,
                updatedAt: true,
                section: true,
              },
              with: {
                metadata: {
                  columns: {
                    title: true,
                    abstract: true,
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
        },
        collectionUsers: {
          with: {
            user: {
              columns: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                affiliation: true,
                avatar: true,
                bio: true,
                prefix: true,
              },
            },
          },
        },
        user: {
          columns: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            affiliation: true,
          },
        },
      },
    });

    return NextResponse.json(allCollections, { status: 200 });
  } catch (error) {
    console.error('Error fetching collections:', error);
    return NextResponse.json(
      { error: 'Failed to load collections' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const {
      title,
      description,
      objective,
      sdgGoal,
      isFeatured,
      thumbnailUrl,
      userId,
      userIds,
      status,
      deadline,
    } = await req.json();
    const session = await auth();

    if (
      !(session?.user.role === 'ADMIN' || session?.user.role === 'CHIEF_EDITOR')
    ) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Support both single userId (backward compatibility) and userIds array
    const userIdsToAssign = userIds || (userId ? [userId] : []);

    if (!userIdsToAssign || userIdsToAssign.length === 0) {
      return NextResponse.json(
        { error: 'At least one user assignment is required' },
        { status: 400 }
      );
    }

    const newCollection = {
      title: title,
      slug: slugify(title),
      description: description,
      objective: objective ?? null,
      sdgGoal: sdgGoal,
      isFeatured: isFeatured ?? false,
      thumbnailUrl: thumbnailUrl,
      userId: userIdsToAssign[0], // Keep userId for backward compatibility
      status: status || 'ACTIVE',
      deadline: deadline || null,
    };

    const [createdCollection] = await db
      .insert(collections)
      .values(newCollection)
      .returning({ id: collections.id });

    // Insert user assignments in the junction table
    if (userIdsToAssign.length > 0) {
      await db.insert(collectionUsers).values(
        userIdsToAssign.map((uid: string) => ({
          collectionId: createdCollection.id,
          userId: uid,
        }))
      );
    }

    return NextResponse.json(
      { message: 'Collection created successfully' },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error creating collection:', error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await auth();

    if (
      !(session?.user.role === 'ADMIN' || session?.user.role === 'CHIEF_EDITOR')
    ) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { collectionId, articleIds } = await req.json();

    console.log('articleIds:', articleIds);
    console.log('collectionId:', collectionId);

    if (
      !collectionId ||
      !Array.isArray(articleIds) ||
      articleIds.length === 0
    ) {
      return NextResponse.json(
        { message: 'Invalid collectionId or articleIds' },
        { status: 400 }
      );
    }

    for (const articleId of articleIds) {
      const article = await db.query.articleSubmissions.findFirst({
        columns: {
          articleStatus: true,
        },
        where: eq(articleSubmissions.id, articleId),
      });

      if (
        !article ||
        (article.articleStatus !== 'ACCEPTED' &&
          article.articleStatus !== 'PUBLISHED')
      ) {
        return NextResponse.json(
          {
            message: `Article(s) is not ACCEPTED or PUBLISHED.`,
          },
          { status: 400 }
        );
      }

      const existing = await db.query.collectionArticles.findFirst({
        where: and(
          eq(collectionArticles.collectionId, collectionId),
          eq(collectionArticles.articleId, articleId)
        ),
      });

      if (existing) {
        return NextResponse.json(
          {
            message: `Article(s) is already assigned to this collection.`,
          },
          { status: 400 }
        );
      }

      await db.insert(collectionArticles).values({
        collectionId,
        articleId,
      });
    }

    return NextResponse.json(
      { message: 'Articles successfully assigned to the collection' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error assigning articles to collection:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
