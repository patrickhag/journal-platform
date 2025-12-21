import { auth } from '@/auth';
import { db } from '@/db/db';
import { reviewAssignments, userRoles, users } from '@/db/schema';
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

    // Fetch all roles for the user
    const allUserRoles = await db.query.userRoles.findMany({
      where: eq(userRoles.userId, userId),
      columns: {
        id: true,
        role: true,
      },
    });

    // Get the first role for backward compatibility (or use the first one if exists)
    const primaryRole = allUserRoles[0]?.role || null;

    // Fetch user with articles and published articles
    const user = await db.query.users.findFirst({
      where: eq(users.id, userId),
      columns: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        isActive: true,
        createdAt: true,
        affiliation: true,
        expertise: true,
        orcid: true,
        country: true,
        bio: true,
        avatar: true,
      },
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
        reviewAssignments: {
          columns: {
            id: true,
            assignedDate: true,
            dueDate: true,
            status: true,
            reviewedDate: true,
          },
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
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Filter articles by status
    const submittedArticles = user.articles.filter(
      (article) => article.articleStatus === 'SUBMITTED'
    );
    const correctionsArticles = user.articles.filter(
      (article) =>
        article.articleStatus === 'UNDER REVIEW' ||
        article.articleStatus === 'CORRECTION'
    );
    const underPressArticles = user.articles.filter(
      (article) => article.articleStatus === 'UNDER PRESS'
    );

    return NextResponse.json({
      roles: allUserRoles,
      role: primaryRole, // For backward compatibility
      user: {
        ...user,
        submittedArticles,
        correctionsArticles,
        underPressArticles,
      },
    });
  } catch (error) {
    console.error('Error fetching user info:', error);
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
