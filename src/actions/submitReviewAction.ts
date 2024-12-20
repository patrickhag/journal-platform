'use server';
import { auth } from '@/auth';
import { articleSubmissions, db, reviews, users } from '@/db/schema';
import { transporter } from '@/lib/emailTransporter';

import { reviewSchema } from '@/schemas/reviewer';
import { eq } from 'drizzle-orm';

import { RedirectType, redirect } from 'next/navigation';

export async function submitReviewAction(_: unknown, formData: FormData) {
  const data = Object.fromEntries(formData.entries());
  const result = reviewSchema.safeParse(data);

  if (!result.success) {
    return result.error.errors;
  }

  const session = await auth();
  const userId = session?.user?.id || '';
  try {
    await db.insert(reviews).values({
      userId: userId,
      message: result.data.message,
      articleId: result.data.articleId,
      fileIds: JSON.parse(result.data.fileIds),
      status: result.data.status
    });

    const articl = await db
      .select({ email: users.email })
      .from(users)
      .leftJoin(articleSubmissions, eq(users.id, articleSubmissions.userId))
      .where(eq(articleSubmissions.id, result.data.articleId))
      .limit(1)
    if (articl[0].email) {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: articl[0].email,
        subject: "You have received a review",
        text: result.data.message
      });

    }
  } catch (error) {
    if (error instanceof Error) return { message: error.message };
  }

  redirect(`/articles/${result.data.articleId}`, RedirectType.push);
}
