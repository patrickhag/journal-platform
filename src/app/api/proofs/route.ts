import { NextResponse } from 'next/server';
import { db } from '@/db/db';
import { articleSubmissions } from '@/db/schema';
import { notifyAdminAboutProof, notifyUser } from '@/lib/emailTransporter';
import { eq } from 'drizzle-orm';
import { auth } from '@/auth';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { status, fileIds, articleId, message } = body;
    const session = await auth();
    const userRole = session?.user.role;

    if (!status || !message || fileIds.length < 1) {
      return NextResponse.json(
        { message: 'Missing required field: message or proofed file.' },
        { status: 400 }
      );
    }

    await db
      .update(articleSubmissions)
      .set({ proofStatus: status, proofNote: message, proofFileUrl: fileIds })
      .where(eq(articleSubmissions.id, articleId));

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
        user: {
          columns: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            role: true,
          },
        },
      },
      where: eq(articleSubmissions.id, articleId),
    });

    const articleTitle = article?.metadata.title;
    const authorName = `${article?.user.firstName as string} ${article?.user.lastName as string}`;
    const authorEmail = article?.user.email as string;

    if (userRole === 'NORMAL_USER') {
      await notifyAdminAboutProof({
        authorName: authorName as string,
        article: articleTitle as string,
      });
    }

    if (userRole === 'CHIEF_EDITOR') {
      await notifyUser({
        articleTitle: articleTitle as string,
        authorName: authorName,
        authorEmail: authorEmail,
        articleLink: `${process.env.NEXT_PUBLIC_URL}/submissions/proof`,
        subject: 'Proofing Stage: Please Review and Confirm Your Article',
        type: 'proof',
      });
    }

    return NextResponse.json({
      message: 'Proof created successfully and author has been informed.',
      status: 201,
    });
  } catch (error) {
    console.error('Failed to create proof article:', error);
    return NextResponse.json(
      { message: 'Something went wrong while creating proof.' },
      { status: 500 }
    );
  }
}
