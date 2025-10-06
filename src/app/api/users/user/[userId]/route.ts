import { auth } from '@/auth';
import { db } from '@/db/db';
import { userRoles, users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

type Params = { userId: string };

export async function GET(
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
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { userId } = await params;

    const foundUserInfo = await db.query.userRoles.findFirst({
      where: eq(userRoles.userId, userId),
      columns: {
        id: true,
        role: true,
      },
      with: {
        user: {
          with: {
            articles: {
              columns: {
                id: true,
                createdAt: true,
                articleStatus: true,
              },
              with: {
                metadata: {
                  columns: {
                    title: true,
                  },
                },
              },
            },
            publishedArticles: {
              columns: {
                id: true,
                publishedAt: true,
                slug: true,
              },
              with: {
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
            },
          },
        },
      },
    });

    return NextResponse.json(foundUserInfo);
  } catch (error) {
    console.error('Error creating volume:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<Params> }
) {
  try {
    const session = await auth();

    if (
      !(session?.user.role === 'CHIEF_EDITOR' || session?.user.role === 'ADMIN')
    ) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { userId } = await params;

    const { isActive, role } = await req.json();

    await db
      .update(userRoles)
      .set({
        role,
      })
      .where(eq(userRoles.userId, userId))
      .returning();

    await db
      .update(users)
      .set({
        isActive,
      })
      .where(eq(users.id, userId))
      .returning();

    return NextResponse.json({
      message: 'User info updated successfully!',
    });
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<Params> }
) {
  try {
    const session = await auth();

    if (
      !(session?.user.role === 'CHIEF_EDITOR' || session?.user.role === 'ADMIN')
    ) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { userId } = await params;

    const { role } = await req.json();

    await db
      .update(userRoles)
      .set({
        role,
      })
      .where(eq(userRoles.userId, userId))
      .returning();

    return NextResponse.json({
      message: 'User info updated successfully!',
    });
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
