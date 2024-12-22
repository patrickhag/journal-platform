'use server';
import { articles as articleSubmissions, db, people, reviews, users } from '@/db/schema';
import { transporter } from '@/lib/emailTransporter';
import { createReviewSchema } from '@/schemas/review';

import { eq } from 'drizzle-orm';

import { RedirectType, redirect } from 'next/navigation';

export async function submitReviewAction(_: unknown, formData: FormData) {
  const data = Object.fromEntries(formData.entries());
  const result = createReviewSchema.safeParse(data);

  if (!result.success) {
    return result.error.errors;
  }

  try {
    await db.insert(reviews).values(result.data);

    const articl = await db
      .select({ email: people.email })
      .from(users)
      .leftJoin(people, eq(users.personId, people.id))
      .leftJoin(articleSubmissions, eq(users.id, articleSubmissions.submittedBy))
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
