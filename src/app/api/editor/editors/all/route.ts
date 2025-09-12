import { auth } from '@/auth';
import { db } from '@/db/db';
import { userRoles } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    // const session = await auth();
    // if (
    //   !(session?.user.role === 'ADMIN' || session?.user.role === 'CHIEF_EDITOR')
    // ) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    const editors = await db.query.userRoles.findMany({
      where: eq(userRoles.role, 'STAFF_EDITOR'),
      with: {
        user: {
          columns: {
            firstName: true,
            lastName: true,
            email: true,
            affiliation: true,
            expertise: true,
          },
          with: {
            editors: {
              columns: {
                assignedAt: true,
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
              },
            },
          },
        },
      },
    });

    return NextResponse.json(editors);
  } catch (error) {
    console.error('Error creating volume:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
