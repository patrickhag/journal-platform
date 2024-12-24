'use server';

import { db, users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export async function disactivateUser(
  id: string | undefined,
  isActive: boolean | null | undefined
) {
  if (!id) return;

  await db
    .update(users)
    .set({
      isActive: !isActive,
    })
    .where(eq(users.id, id));
  revalidatePath('/users');
  return 'success';
}
