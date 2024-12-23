'use server';

import { auth } from '@/auth';
import { db, notifications, users } from '@/db/schema';
import { sendInvitation } from '@/lib/emailTransporter';
import { eq } from 'drizzle-orm';

export async function reachOut(_: unknown, formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) return null;
  // get the user role from db

  const currentUserRole = await db
    .select({ role: users.role })
    .from(users)
    .where(eq(users.id, session.user.id))
    .limit(1);

  if (
    currentUserRole[0].role !== 'CHIEF_EDITOR' &&
    currentUserRole[0].role !== 'ADMIN'
  )
    return;

  await sendInvitation({
    article: {
      ...JSON.parse(formData.get('article')?.toString() || ''),
      content: formData.get('message')?.toString() || '',
    },
    reviewer: formData.get('reviewer')?.toString() || '',
    author: JSON.parse(formData.get('author')?.toString() || ''),
    toEmail: formData.get('toEmail')?.toString() || '',
  });
  const userIds = await db
    .select({
      id: users.id,
    })
    .from(users)
    .where(eq(users.email, formData.get('toEmail')?.toString() || ''))
    .limit(1);
  await db.insert(notifications).values({
    message: formData.get('message')?.toString() || '',
    userId: userIds[0].id,
  });
  return 'Message sent';
}
