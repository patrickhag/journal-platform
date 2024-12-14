'use server';

import { db, notifications } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { redirect, RedirectType } from 'next/navigation';

export async function markAllAsRead(_: unknown, { id, pathname }: { pathname: string, id: string }) {
    await db.update(notifications).set({
        isRead: true
    }).where(eq(notifications.userId, id))
    redirect(pathname, RedirectType.replace)
    return "success"
}