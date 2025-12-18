import { auth } from '@/auth';
import { db } from '@/db/db';
import {
  articleSubmissions,
  reviewAssignments,
  reviewers,
  userRoles,
  users,
} from '@/db/schema';
import { sendInvitation } from '@/lib/emailTransporter';
import bcrypt from 'bcryptjs';
import { and, eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { toEmail: reviewerEmail, articleId, date: dueDate } = body;

    const session = await auth();

    if (
      !(
        session?.user.role === 'CHIEF_EDITOR' ||
        session?.user.role === 'STAFF_EDITOR'
      )
    ) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const foundReviewer = await db
      .select({
        id: reviewers.id,
        names: reviewers.names,
        expertise: reviewers.expertise,
        affiliation: reviewers.affiliation,
      })
      .from(reviewers)
      .where(eq(reviewers.email, reviewerEmail))
      .limit(1);

    if (!foundReviewer) {
      return NextResponse.json({ message: 'Reviewer not found' });
    }

    const { names, id: reviewerId, expertise, affiliation } = foundReviewer[0];
    const nameParts = names.split(' ');
    const firstName = nameParts.length > 2 ? nameParts[1] : nameParts[0];
    const lastName = nameParts.length > 2 ? nameParts[2] : nameParts[1];
    const password = `@123${firstName}`;

    // Check if user exists
    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, reviewerEmail),
    });

    let userId;
    let reviewAssignmentId;
    if (!existingUser) {
      // Insert new user
      const [newUser] = await db
        .insert(users)
        .values({
          firstName,
          lastName,
          email: reviewerEmail,
          password: await bcrypt.hash(`@JAEPH${password}`, 10),
          expertise,
          affiliation,
        })
        .returning({ id: users.id });

      // Check if the user already has the 'REVIEWER' role before assigning it
      const existingRole = await db.query.userRoles.findFirst({
        where: and(
          eq(userRoles.userId, newUser.id),
          eq(userRoles.role, 'REVIEWER')
        ),
      });

      if (!existingRole) {
        await db.insert(userRoles).values({
          userId: newUser.id,
          role: 'REVIEWER',
        });
      }

      userId = newUser.id;
    } else {
      userId = existingUser.id;
    }

    const isReviewerAlreadyAssigned =
      await db.query.reviewAssignments.findFirst({
        where: and(
          eq(reviewAssignments.userId, userId),
          eq(reviewAssignments.articleId, articleId)
        ),
      });

    if (isReviewerAlreadyAssigned) {
      return NextResponse.json(
        { message: 'Reviewer has already been assigned to this article' },
        { status: 409 }
      );
    } else {
      const [reviewerAssignment] = await db
        .insert(reviewAssignments)
        .values({
          articleId,
          reviewerId,
          dueDate,
          userId,
        })
        .returning({ id: reviewAssignments.id });
      reviewAssignmentId = reviewerAssignment.id;
    }

    const article = await db.query.articleSubmissions.findFirst({
      columns: {
        id: true,
      },
      with: {
        metadata: {
          columns: {
            title: true,
            abstract: true,
          },
        },
      },
      where: eq(articleSubmissions.id, articleId),
    });

    // Send invitation
    await sendInvitation({
      reviewerNames: names,
      articleId,
      dueDate,
      articleTitle: article?.metadata.title as string,
      isAlreadyUser: existingUser ? true : false,
      toEmail: reviewerEmail,
      password,
      abstract: article?.metadata.abstract as string,
      reviewAssignmentId: reviewAssignmentId as string,
    });

    return NextResponse.json(
      {
        message: 'Reviewer invited and informed successfully',
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error assigning editor:', error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    } else {
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  }
}
