import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db/db';
import { auth } from '@/auth';
import { authorRevisions } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    const reviewerId = session?.user.id;

    // const foundAuthorRevisions = await db.query.authorRevisions.findFirst({
    //   where: eq(authorRevisions.reviewerId, reviewerId as string),
    //   columns: {
    //     id: true,
    //   },
    //   with: {
    //     articleSubmissions: {
    //       columns: {
    //         id: true,
    //       },
    //       with: {
    //         user: {
    //           columns: {
    //             firstName: true,
    //             lastName: true,
    //           },
    //         },
    //         metadata: {
    //           columns: {
    //             prefix: true,
    //             title: true,
    //           },
    //         },
    //       },
    //     },
    //   },
    // });

    return NextResponse.json({ message: reviewerId });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
