'use server';

import { signIn } from '@/auth';
import { db, files, passwordResets, users } from '@/db/schema';
import { AuthError } from 'next-auth';
import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';
import { loginSchema, registerSchema } from '@/schemas/auth.schema';
import { isPasswordMatch } from './helpers';
import z from 'zod'
import { sendPasswordResetEmail } from './emailTransporter';
import crypto from 'node:crypto'
import { RESET_PASSWORD_EXPIRATION_TIME } from './consts';
import { v2 as cloudinary } from "cloudinary";

export async function authenticate(
  prevState: string | undefined,
  formData: FormData
) {
  try {

    const login = loginSchema.safeParse(Object.fromEntries(formData.entries()))
    if (login.error) return login.error.errors[0].message

    await signIn('credentials', login.data);
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
export async function resetPassword(
  prevState: string | undefined,
  formData: FormData
) {
  try {
    const login = loginSchema.safeParse(Object.fromEntries(formData.entries()))
    if (login.error) return login.error.errors[0].message

    const user = await db.select().from(users).where(eq(users.email, login.data.email)).limit(1)

    if (!user[0])
      return 'User not found'

    const token = crypto.randomBytes(24).toString('base64')
    const hashedPassword = bcrypt.hashSync(login.data.password);

    await db.insert(passwordResets).values({
      expires: new Date(Date.now() + RESET_PASSWORD_EXPIRATION_TIME),
      identifier: login.data.email,
      token,
      password: hashedPassword
    })
    await sendPasswordResetEmail({ subject: 'reset your email', toEmail: login.data.email, url: process.env.NEXT_PUBLIC_FRONTEND_URL! + '/api/auth/reset-password?id=' + token })

    return 'Success';
  } catch (error) {
    console.log(error)
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

export async function register(
  prevState: { message: string, data?: Partial<z.infer<typeof registerSchema>> } | undefined,
  formData: FormData
) {
  try {
    const confirmPassword = formData.get('ConfirmPassword')?.toString()
    const register = registerSchema.safeParse(Object.fromEntries(formData.entries()))
    if (register.error) return { message: register.error.errors[0].message, data: Object.fromEntries(formData.entries()) as Partial<z.infer<typeof registerSchema>> }

    if (!confirmPassword || !isPasswordMatch(register.data.password, confirmPassword)) {
      return { message: "password and confirm password don't match", data: register.data }
    }

    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, register.data.email))
      .limit(1);

    if (existingUser.length > 0) {
      return { message: "Email already in use.", data: register.data }
    }

    const hashedPassword = bcrypt.hashSync(register.data.password);

    const user = {
      ...register.data,
      password: hashedPassword,
    };


    await db.insert(users).values(user);
    return { message: "Registration successful", data: register.data }

  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return { message: 'Invalid credentials.' };
        default:
          return { message: 'Something went wrong during registration.' }
      }
    }
    return { message: 'An unexpected error occurred during registration.' }
  }
}


export async function deteteresource(prevState: any,
  formData: FormData) {
  cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
    api_secret: process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET,
  })
  const publicId = formData.get('publicId')?.toString()
  if (!publicId) return {}
  try {
    await db.delete(files).where(eq(files.publicId, publicId));
    const res = await cloudinary.uploader
      .destroy(publicId, {
        type: 'upload',
        resource_type: 'raw',
      })
    res.publicId = publicId
    return res
    
  } catch (error: any) {
    return error.message
  }
}

export async function addFileType(
  prevState: any,
  formData: FormData) {
  const fileTypeSchema = z.object({
    publicId: z.string(),
    resourceType: z.string(),
    fileType: z.string(),
    originalName: z.string()
  })
  const fileType = fileTypeSchema.safeParse(Object.fromEntries(formData.entries()))
  if (fileType.error) return fileType.error.errors[0].message
  try {
    await db.insert(files).values(fileType.data)
  } catch (error) {
    return "Update failed"
  }
  return "success"
}