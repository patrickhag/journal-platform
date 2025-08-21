'use server';

import { db } from '@/db/db';
import { newsletterSubscribers } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function subscribeNewsletter(formData: FormData) {
  const email = formData.get('email')?.toString().trim();

  if (!email || !/\S+@\S+\.\S+/.test(email)) {
    return { success: false, message: 'Please enter a valid email address.' };
  }

  const existing = await db
    .select()
    .from(newsletterSubscribers)
    .where(eq(newsletterSubscribers.email, email));

  if (existing.length > 0) {
    return { success: false, message: 'You are already subscribed.' };
  }

  await db.insert(newsletterSubscribers).values({ email });
  return {
    success: true,
    message: 'Thank you for subscribing to our newsletter!',
  };
}
