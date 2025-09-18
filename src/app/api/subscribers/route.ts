import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db/db';
import { auth } from '@/auth';
import { sendEmailToSubscribers } from '@/lib/emailTransporter';

export async function GET(req: NextRequest) {
  try {
    const session = await auth();

    if (
      !(session?.user.role === 'ADMIN' || session?.user.role === 'CHIEF_EDITOR')
    ) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const allSubscribers = await db.query.newsletterSubscribers.findMany();

    return NextResponse.json(allSubscribers);
  } catch (error) {
    console.error('Error creating volume:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { message, subject } = body;

    const emails = await db.query.newsletterSubscribers.findMany({
      columns: { email: true },
    });

    for (const subscriber of emails) {
      await sendEmailToSubscribers({
        subscriberEmail: subscriber.email,
        subject,
        message,
      });
    }

    return NextResponse.json(
      {
        message: 'Email sent to subscribers successfully.',
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error sending email:', error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    } else {
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  }
}
