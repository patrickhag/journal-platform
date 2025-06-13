'use server';

import { auth } from '@/auth';
import { db } from '@/db/db';
import {
  notifications,
  reviewAssignments,
  reviewers,
  users,
} from '@/db/schema';
import { sendInvitation } from '@/lib/emailTransporter';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcrypt';

export async function reachOut(_: unknown, formData: FormData) {
  const session = await auth();

  const editorInChiefId = session?.user?.id;

  // Convert FormData entries to an object for better logging
  const formDataObject = Object.fromEntries(formData.entries());
  console.log('formData >>>', formDataObject);

  if (!editorInChiefId) return null;

  if (session.user.role !== 'CHIEF_EDITOR') return;

  const toEmail = formData.get('toEmail')?.toString() || '';
  const reviewer = formData.get('reviewer')?.toString() || '';
  const dueDate = formData.get('dueDate')?.toString() || '';

  const { article: articleId } = JSON.parse(
    formData.get('article')?.toString() || '{}'
  );

  const foundReviewer = await db.query.reviewers.findFirst({
    columns: {
      id: true,
    },
    where: eq(reviewers.email, toEmail),
  });

  if (!foundReviewer) return 'No reviewer found';

  // Split reviewer name
  const nameParts = reviewer.split(' ');
  const firstName = nameParts.length > 2 ? nameParts[1] : nameParts[0];
  const lastName = nameParts.length > 2 ? nameParts[2] : nameParts[1];

  // Check if user exists
  const existingUser = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.email, toEmail))
    .limit(1);

  let userId;
  if (existingUser.length === 0) {
    const password = `@123${firstName}`;

    // Insert new user
    const [newUser] = await db
      .insert(users)
      .values({
        firstName: firstName,
        lastName: lastName,
        email: toEmail,
        password: await bcrypt.hash(password, 10),
        role: 'REVIEWER',
      })
      .returning({ id: users.id });

    userId = newUser.id;
  } else {
    userId = existingUser[0].id;
  }

  await db.insert(reviewAssignments).values({
    articleId,
    reviewerId: foundReviewer.id,
    dueDate,
  });

  // Send invitation
  await sendInvitation({
    article: {
      ...JSON.parse(formData.get('article')?.toString() || '{}'),
      content: formData.get('message')?.toString() || '',
    },
    reviewer,
    toEmail,
    isAlreadyUser: existingUser.length > 0,
    editorInChiefId,
    dueDate,
  });

  // Add notification
  await db.insert(notifications).values({
    message: formData.get('message')?.toString() || '',
    userId,
  });

  return 'Message sent';
}
