'use server';

import { db, users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import jwt from 'jsonwebtoken';
import { sendVerifyToken } from '@/lib/emailTransporter';

export async function resendVerificationEmail(email: string) {
  try {
    // Find user by email
    const user = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (user.length === 0) {
      return {
        success: false,
        message: 'No account found with this email address.',
      };
    }

    const userData = user[0];

    // Check if email is already verified
    if (userData.isActive) {
      return {
        success: false,
        message: 'Your email has already been verified. You can log in now.',
      };
    }

    // Generate new verification token
    const verificationToken = jwt.sign(
      { id: userData.id },
      process.env.NEXTAUTH_SECRET!,
      { expiresIn: '2d' }
    );

    // Send verification email
    try {
      const userName = userData.firstName
        ? `${userData.firstName}${userData.lastName ? ` ${userData.lastName}` : ''}`
        : undefined;
      await sendVerifyToken({
        email: userData.email!,
        token: verificationToken,
        name: userName,
      });

      return {
        success: true,
        message:
          'Verification email sent successfully! Please check your inbox.',
      };
    } catch (emailError) {
      console.error('Error sending verification email:', emailError);
      return {
        success: false,
        message: 'Failed to send verification email. Please try again later.',
      };
    }
  } catch (error) {
    console.error('Error in resendVerificationEmail:', error);
    return {
      success: false,
      message: 'An unexpected error occurred. Please try again later.',
    };
  }
}
