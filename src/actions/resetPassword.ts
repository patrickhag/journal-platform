'use server';

import crypto from 'node:crypto';
import { db, passwordResets, users } from '@/db/schema';
import { loginSchema } from '@/schemas/auth.schema';
import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';
import { AuthError } from 'next-auth';
import { sendPasswordResetEmail } from '@/lib/emailTransporter';
import { RESET_PASSWORD_EXPIRATION_TIME } from '@/lib/consts';

export async function resetPassword(
  _prevState: string | undefined,
  formData: FormData
) {
  try {
    const login = loginSchema.safeParse(Object.fromEntries(formData.entries()));
    if (login.error) return login.error.errors[0].message;

    const user = await db
      .select()
      .from(users)
      .where(eq(users.email, login.data.email))
      .limit(1);

    if (!user[0]) return 'User not found';

    const token = crypto.randomBytes(24).toString('base64');
    const hashedPassword = bcrypt.hashSync(login.data.password);

    await db.insert(passwordResets).values({
      expires: new Date(Date.now() + RESET_PASSWORD_EXPIRATION_TIME),
      identifier: login.data.email,
      token,
      password: hashedPassword,
    });
    await sendPasswordResetEmail({
      subject: 'Password Change Confirmation for JAEPH',
      toEmail: login.data.email,
      url: `${process.env
        .NEXT_PUBLIC_FRONTEND_URL!}/api/auth/reset-password?id=${token}`,
      name: user[0].firstName!,
    });

    return 'Success';
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Invalid credentials.';
        default:
          return 'Something went wrong during sign-in.';
      }
    }
    return 'An unexpected error occurred during authentication.';
  }
}
