'use server';
import { auth } from '@/auth';
import {
    db,
    reviewers,
} from '@/db/schema';
import { reviewerSchema } from '@/schemas/reviewer';
import { revalidatePath } from 'next/cache';
import { RedirectType, redirect } from 'next/navigation';
import { z } from 'zod';

export async function addReviewerAction(_: unknown, formData: z.infer<typeof reviewerSchema> & { articleId: string }) {

    let isError = false;
    const session = await auth();
    const userId = session?.user?.id || '';
    isError = true;

    await db.insert(reviewers).values({ ...formData, userId }).execute();
    revalidatePath('/articles/' + formData.articleId);
}
