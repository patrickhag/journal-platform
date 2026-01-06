'use server';

import { signIn } from '@/auth';
import { loginSchema } from '@/schemas/auth.schema';
import { AuthError } from 'next-auth';
import { redirect, RedirectType } from 'next/navigation';
import type z from 'zod';

export async function authenticate(
  _prevState: string | undefined,
  formData: z.infer<typeof loginSchema> & { redirect?: string }
) {
  try {
    await signIn('credentials', {
      redirect: false,
      email: formData.email,
      password: formData.password,
      role: formData.role,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          // Get the error code from the custom error
          // Check multiple possible locations for the error code
          let errorCode: string | null = null;

          // Check if error has a code property directly
          if ('code' in error && typeof error.code === 'string') {
            errorCode = error.code;
          }
          // Check error.cause for code
          else if (
            error.cause &&
            typeof error.cause === 'object' &&
            'code' in error.cause
          ) {
            errorCode = (error.cause as { code: string }).code;
          }
          // Check error message as fallback
          else if (error.message) {
            errorCode = error.message;
          }

          switch (errorCode) {
            case 'EMAIL_NOT_VERIFIED':
              return 'EMAIL_NOT_VERIFIED';
            case 'USER_NOT_FOUND':
              return 'USER_NOT_FOUND';
            case 'INVALID_PASSWORD':
              return 'INVALID_PASSWORD';
            case 'INVALID_ROLE':
              return 'INVALID_ROLE';
            case 'PASSWORD_NOT_SET':
              return 'PASSWORD_NOT_SET';
            case 'MISSING_CREDENTIALS':
              return 'MISSING_CREDENTIALS';
            default:
              // Log for debugging
              console.error('CredentialsSignin error details:', {
                type: error.type,
                message: error.message,
                cause: error.cause,
                errorCode,
              });
              return 'Invalid credentials. Please check your email, password, and role.';
          }
        default:
          return 'Something went wrong during sign-in.';
      }
    }

    return 'An unexpected error occurred. Please try again.';
  }

  if (formData.redirect) {
    return redirect(formData.redirect, RedirectType.replace);
  }

  const role = formData.role;
  switch (role) {
    case 'NORMAL_USER':
      return redirect('/author/submissions', RedirectType.replace);
    case 'STAFF_EDITOR':
      return redirect('/staff-editor/assignments', RedirectType.replace);
    case 'REVIEWER':
      return redirect('/reviewer/assignments', RedirectType.replace);
    case 'ASSOCIATE_EDITOR':
      return redirect('/associate-editor/assignments', RedirectType.replace);
    case 'CHIEF_EDITOR':
    case 'ADMIN':
      return redirect('/editor/dashboard', RedirectType.replace);
    default:
      return redirect('/', RedirectType.replace);
  }
}
