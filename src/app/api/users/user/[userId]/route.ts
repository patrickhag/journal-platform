import { auth } from '@/auth';
import { db } from '@/db/db';
import {
  associateEditorAssignments,
  editorAssignment,
  reviewAssignments,
  userRoles,
  users,
} from '@/db/schema';
import { eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

type Params = { userId: string };

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<Params> }
) {
  try {
    const session = await auth();

    const { userId } = await params;
    const sessionUserId = session?.user?.id;
    const canAccess =
      sessionUserId === userId ||
      session?.user.role === 'CHIEF_EDITOR' ||
      session?.user.role === 'STAFF_EDITOR';

    if (!canAccess) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

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

    // Extract role names for conditional queries
    const roleNames = allUserRoles.map((r) => r.role);
    const isAuthor = roleNames.includes('NORMAL_USER');
    const isReviewer = roleNames.includes('REVIEWER');
    const isAssociateEditor = roleNames.includes('ASSOCIATE_EDITOR');
    const isStaffEditor = roleNames.includes('STAFF_EDITOR');

    // Build the with clause conditionally based on roles
    const withClause: any = {
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
    };

    // Only fetch articles if user is an Author
    if (isAuthor) {
      withClause.articles = {
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
      };
    }

    // Only fetch review assignments if user is a Reviewer
    if (isReviewer) {
      withClause.reviewAssignments = {
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
      };
    }

    // Fetch user with conditional relations
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
        prefix: true,
      },
      with: withClause,
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Filter articles by status (only if user is an Author)
    const userWithArticles = user as typeof user & {
      articles?: Array<{
        id: string;
        createdAt: string;
        articleStatus: string;
        metadata: { title: string } | null;
      }>;
    };

    const submittedArticles =
      isAuthor && userWithArticles.articles
        ? userWithArticles.articles.filter(
            (article: {
              id: string;
              createdAt: string;
              articleStatus: string;
              metadata: { title: string } | null;
            }) => article.articleStatus === 'SUBMITTED'
          )
        : [];
    const correctionsArticles =
      isAuthor && userWithArticles.articles
        ? userWithArticles.articles.filter(
            (article: {
              id: string;
              createdAt: string;
              articleStatus: string;
              metadata: { title: string } | null;
            }) =>
              article.articleStatus === 'UNDER REVIEW' ||
              article.articleStatus === 'CORRECTION'
          )
        : [];
    const underPressArticles =
      isAuthor && userWithArticles.articles
        ? userWithArticles.articles.filter(
            (article: {
              id: string;
              createdAt: string;
              articleStatus: string;
              metadata: { title: string } | null;
            }) => article.articleStatus === 'UNDER PRESS'
          )
        : [];

    // Fetch associate editor assignments if user is Associate Editor
    let associateEditorAssignmentsData: any[] = [];
    if (isAssociateEditor) {
      associateEditorAssignmentsData =
        await db.query.associateEditorAssignments.findMany({
          where: eq(associateEditorAssignments.userId, userId),
          columns: {
            id: true,
            assignedAt: true,
            dueDate: true,
            status: true,
            finalizedAt: true,
            message: true,
          },
          with: {
            articleSubmissions: {
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
            staffEditor: {
              columns: {
                firstName: true,
                lastName: true,
                email: true,
              },
            },
          },
        });
    }

    // Fetch editor assignments if user is Staff Editor
    let editorAssignmentsData: any = null;
    if (isStaffEditor) {
      const allEditorAssignments = await db.query.editorAssignment.findMany({
        where: eq(editorAssignment.userId, userId),
        columns: {
          id: true,
          assignedAt: true,
        },
        with: {
          articleSubmission: {
            columns: {
              id: true,
              articleStatus: true,
              createdAt: true,
            },
            with: {
              metadata: {
                columns: {
                  title: true,
                },
              },
              user: {
                columns: {
                  firstName: true,
                  lastName: true,
                  email: true,
                },
              },
            },
          },
        },
      });

      // Filter editor assignments by status
      const submittedEditorAssignments = allEditorAssignments.filter(
        (assignment) =>
          assignment.articleSubmission?.articleStatus === 'SUBMITTED'
      );
      const correctionsEditorAssignments = allEditorAssignments.filter(
        (assignment) =>
          assignment.articleSubmission?.articleStatus === 'UNDER REVIEW' ||
          assignment.articleSubmission?.articleStatus === 'CORRECTION'
      );
      const underPressEditorAssignments = allEditorAssignments.filter(
        (assignment) =>
          assignment.articleSubmission?.articleStatus === 'UNDER PRESS'
      );

      editorAssignmentsData = {
        all: allEditorAssignments,
        submitted: submittedEditorAssignments,
        corrections: correctionsEditorAssignments,
        underPress: underPressEditorAssignments,
      } as any;
    }

    const userWithReviewAssignments = user as typeof user & {
      reviewAssignments?: Array<{
        id: string;
        assignedDate: string | null;
        dueDate: string | null;
        status: string;
        reviewedDate: string | null;
        article: {
          id: string;
          articleStatus: string;
          metadata: { title: string } | null;
        } | null;
      }>;
    };

    return NextResponse.json({
      roles: allUserRoles,
      role: primaryRole, // For backward compatibility
      user: {
        ...user,
        submittedArticles,
        correctionsArticles,
        underPressArticles,
        reviewAssignments: isReviewer
          ? userWithReviewAssignments.reviewAssignments || []
          : [],
        associateEditorAssignments: associateEditorAssignmentsData,
        editorAssignments: editorAssignmentsData,
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
    const sessionUserId = session?.user?.id;

    if (!sessionUserId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { userId } = await params;
    const isSelf = sessionUserId === userId;
    const isAdmin =
      session?.user.role === 'CHIEF_EDITOR' || session?.user.role === 'ADMIN';

    const body = await req.json();

    if (isSelf && !isAdmin) {
      const updateData: Record<string, string | null | undefined> = {
        prefix: body.prefix,
        firstName: body.firstName,
        lastName: body.lastName,
        affiliation: body.affiliation,
        country: body.country,
        orcid: body.orcid,
        bio: body.bio,
        expertise: body.expertise,
        avatar: body.avatar,
      };

      const sanitizedUpdates = Object.fromEntries(
        Object.entries(updateData).filter(
          ([, value]) => typeof value !== 'undefined'
        )
      );

      const hasUpdates = Object.keys(sanitizedUpdates).length > 0;

      if (!hasUpdates) {
        return NextResponse.json({ error: 'No values to set' }, { status: 400 });
      }

      await db.update(users).set(sanitizedUpdates).where(eq(users.id, userId));

      return NextResponse.json({
        message: 'Profile updated successfully!',
      });
    }

    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { isActive, role } = body;
    const shouldUpdateRole = typeof role !== 'undefined';
    const shouldUpdateStatus = typeof isActive !== 'undefined';

    if (!shouldUpdateRole && !shouldUpdateStatus) {
      return NextResponse.json({ error: 'No values to set' }, { status: 400 });
    }

    if (shouldUpdateRole) {
      await db
        .update(userRoles)
        .set({
          role,
        })
        .where(eq(userRoles.userId, userId))
        .returning();
    }

    // Only update 'isActive' if it is not undefined
    if (shouldUpdateStatus) {
      await db
        .update(users)
        .set({
          isActive,
        })
        .where(eq(users.id, userId))
        .returning();
    }

    return NextResponse.json({
      message: 'User info updated successfully!',
    });
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error updating user:', error.message);
    }
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
