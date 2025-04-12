'use server';
import { auth } from '@/auth';
import { db } from '@/db/db';
import { articleSubmissions, notifications, reviews, users } from '@/db/schema';
import { transporter } from '@/lib/emailTransporter';

import { reviewSchema } from '@/schemas/reviewer';
import { eq } from 'drizzle-orm';
import { RedirectType, redirect } from 'next/navigation';
import { notifyAdmin } from '@/lib/emailTransporter';

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
      status: result.data.status,
    });

    const adminUser = await db
      .select({ id: users.id, email: users.email })
      .from(users)
      .where(eq(users.role, 'ADMIN'));

    const article = await db.query.articleSubmissions.findFirst({
      columns: {
        id: true,
      },
      with: {
        metadata: {
          columns: {
            title: true,
          },
        },
      },
      where: eq(articleSubmissions.id, result.data.articleId),
    });

    const articleTitle = article?.metadata.title;

    // send email to admin
    await notifyAdmin({
      article: articleTitle as string,
      authorName: session?.user?.name as string,
      subject: 'New Review Submitted',
      participant: 'REVIEWER',
      articleId: article?.id as string,
    });

    // send in-app notification for admin
    await db.insert(notifications).values({
      message: `New review submitted for article ${articleTitle}`,
      userId: adminUser[0].id as string,
      kind: 'Info',
    });
  } catch (error) {
    if (error instanceof Error) return { message: error.message };
  }

  redirect(`/articles/${result.data.articleId}`, RedirectType.push);
}
