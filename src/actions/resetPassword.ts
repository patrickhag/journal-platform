'use server';

import { db, passwordResets, users } from '@/db/schema';
import { loginSchema } from '@/schemas/auth.schema';
import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';
import { AuthError } from 'next-auth';
import { sendPasswordResetEmail } from '@/lib/emailTransporter';
import { RESET_PASSWORD_EXPIRATION_TIME } from '@/lib/consts';

export async function resetPassword(
  _prevState: any,
  formData: FormData
): Promise<{ message: string; success: boolean } | undefined> {
  try {
    const login = loginSchema.safeParse(Object.fromEntries(formData.entries()));
    if (login.error)
      return { message: login.error.errors[0].message, success: false };

    const user = await db
      .select()
      .from(users)
      .where(eq(users.email, login.data.email))
      .limit(1);

    if (!user[0]) return { message: 'User not found', success: false };

    const token = Math.random().toString(36).substring(2, 15);
    const hashedPassword = bcrypt.hashSync(login.data.password);

    await db.insert(passwordResets).values({
      expires: new Date(Date.now() + RESET_PASSWORD_EXPIRATION_TIME),
      identifier: login.data.email,
      token,
      password: hashedPassword,
    });

    const emailSent = await sendPasswordResetEmail({
      subject: 'Password Change Confirmation for JAEPH',
      toEmail: login.data.email,
      url: `${process.env
        .NEXT_PUBLIC_FRONTEND_URL!}/api/auth/reset-password?id=${token}`,
      name: user[0].firstName!,
    });
    if (emailSent)
      return {
        message: 'Password confirmation sent to your email.',
        success: true,
      };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return { message: 'Invalid credentials.', success: false };
        default:
          return {
            message: 'Something went wrong during sign-in.',
            success: false,
          };
      }
    }
    return {
      message: 'An unexpected error occurred during authentication.',
      success: false,
    };
  }
}
