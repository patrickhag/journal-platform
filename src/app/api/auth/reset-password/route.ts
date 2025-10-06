import { passwordResets, users, db } from '@/db/schema';
import { RESET_PASSWORD_EXPIRATION_TIME } from '@/lib/consts';
import { eq } from 'drizzle-orm';
import { redirect } from 'next/navigation';
import { NextResponse, NextRequest } from 'next/server';
import bcrypt from 'bcryptjs';
import { sendPasswordResetEmail } from '@/lib/emailTransporter';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    const user = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (user.length === 0) {
      return NextResponse.json(
        { message: 'No user found with provided email', success: false },
        { status: 404 }
      );
    }

    const token = crypto.randomUUID();
    const hashedPassword = await bcrypt.hash(password, 10);

    // Delete any existing password reset records for this email
    await db.delete(passwordResets).where(eq(passwordResets.identifier, email));

    await db.insert(passwordResets).values({
      expires: new Date(Date.now() + RESET_PASSWORD_EXPIRATION_TIME),
      identifier: email,
      token,
      password: hashedPassword,
    });

    const emailResult = await sendPasswordResetEmail({
      subject: 'Password Change Confirmation for JAEPH',
      toEmail: email,
      url: `${process.env
        .NEXT_PUBLIC_URL!}/api/auth/reset-password?id=${token}`,
      name: user[0].firstName as string,
    });

    if (!emailResult.success) {
      console.error('Failed to send password reset email:', emailResult.error);
      return NextResponse.json(
        {
          message: 'Failed to send password reset email. Please try again.',
          success: false,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: 'Password confirmation sent to your email.',
      success: true,
    });
  } catch (error) {
    console.error('Password reset error:', error);
    return NextResponse.json(
      {
        message: 'An unexpected error occurred during resetting.',
        success: false,
      },
      { status: 500 }
    );
  }
}

export const GET = async (request: NextRequest) => {
  const url = new URL(request.url);
  const searchParams = url.searchParams;
  const token = searchParams.get('id');

  if (!token) redirect('/login');

  const data = await db
    .select()
    .from(passwordResets)
    .where(eq(passwordResets.token, token))
    .limit(1);

  const userRequest = data[0];

  if (!userRequest) {
    return redirect('/forgot-password?msg=Invalid or expired token');
  }

  const expirationTime = userRequest.expires.getTime();
  if (expirationTime < Date.now()) {
    return redirect(
      '/forgot-password?msg=Token has expired. Please request again'
    );
  }

  await db
    .update(users)
    .set({ password: userRequest.password })
    .where(eq(users.email, userRequest.identifier))
    .execute();

  // Clean up the password reset record after successful update
  await db.delete(passwordResets).where(eq(passwordResets.token, token));

  return redirect('/login');
};
