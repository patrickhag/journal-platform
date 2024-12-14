'use server';

import { db, notifications, users } from '@/db/schema';
import { sendInvitation } from '@/lib/emailTransporter';
import { eq } from 'drizzle-orm';


export async function reachOut(_: unknown, formData: FormData) {
    await sendInvitation({
        article: {
            ...JSON.parse(formData.get('article')?.toString() || ''),
            content: formData.get('message')?.toString() || '',
        },
        reviewer: formData.get('reviewer')?.toString() || '',
        author: JSON.parse(formData.get('author')?.toString() || ''),
        toEmail: formData.get('toEmail')?.toString() || '',
    });
    const userIds = await db.select({
        id: users.id
    }).from(users).where(eq(users.email, formData.get('toEmail')?.toString() || '')).limit(1)
    await db.insert(notifications).values({
        message: formData.get('message')?.toString() || '',
        userId: userIds[0].id
    })
    return 'Message sent';
}
