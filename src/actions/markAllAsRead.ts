'use server';

import { db, notifications } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { redirect, RedirectType } from 'next/navigation';

export async function markAllAsRead(formData: FormData) {
  const id = formData.get('id') as string;
  const pathname = formData.get('pathname') as string;

  await db
    .update(notifications)
    .set({ isRead: true })
    .where(eq(notifications.userId, id));

  redirect(pathname, RedirectType.replace);
}
