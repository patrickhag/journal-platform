'use server';

import { signIn } from '@/auth';
import { metadata, db, files, passwordResets, users, contributors, reviewers, articleSubmissions, finalSubmissions } from '@/db/schema';
import { AuthError } from 'next-auth';
import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';
import { loginSchema, registerSchema } from '@/schemas/auth.schema';
import z from 'zod'
import { sendPasswordResetEmail } from './emailTransporter';
import crypto from 'node:crypto'
import { RESET_PASSWORD_EXPIRATION_TIME } from './consts';
import { v2 as cloudinary } from "cloudinary";
import { contributorFormSchema } from '@/schemas/upload';
import { CloudinaryUploadWidgetInfo } from 'next-cloudinary';
import { articleSubmitionSchema, filesSchema, reviewerSchema } from '@/schemas/reviewer';
import { safeParse } from 'zod-urlsearchparams';
import { metadataSchema } from '@/components/upload/ContributorsForm';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET,
})

export async function authenticate(
  _prevState: string | undefined,
  formData: z.infer<typeof loginSchema>
) {
  try {
    const login = loginSchema.safeParse(formData)
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
    return 'Success';
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
  formData: z.infer<typeof registerSchema>
) {
  try {
    const register = registerSchema.safeParse(formData)
    if (register.error) return { message: register.error.errors[0].message, data: formData }

   
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

export async function deteteresource(_: unknown,
  formData: FormData) {

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

  } catch (error: unknown) {
    if(error instanceof Error){
      return error.message
    }
  }
}

export async function getSignature() {

  const timestamp = Math.round(Date.now() / 1000);
  const params = { timestamp, folder: "journal_upload" };
  const api_secret = process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET;
  const signature = cloudinary.utils.api_sign_request(
    params,
    api_secret as string
  );

  return { timestamp, signature, api_key: cloudinary.config().api_key };
}


export async function createUpload(_: { message?: string; data?: CloudinaryUploadWidgetInfo } | undefined, formData: FormData) {
  const files = formData.get("files");
  const fileBuffer = await (files instanceof Blob ? files.arrayBuffer() : null);

  const mime = (files as File)?.type;
  const encoding = "base64";
  const base64Data = fileBuffer
    ? Buffer.from(fileBuffer).toString("base64")
    : "";
  const fileUri = "data:" + mime + ";" + encoding + "," + base64Data;
  try {
    const uploadToCloudinary = () => {
      return new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload(fileUri, {
            invalidate: true,
          })
          .then(resolve)
          .catch(reject);
      });
    };

    const result = await uploadToCloudinary() as CloudinaryUploadWidgetInfo;
    if (!result) {
      return { message: "Upload failed" }
    }

    console.log(result);
    return { data: result };
  } catch (error) {
    console.log("server err", error);
    return { message: "Internal Server Error" }
  }
}


export async function addReviewer(_: unknown, formData: FormData) {

  const validatedFields = reviewerSchema.safeParse(formData)
  if (!validatedFields.success) {
    return { error: validatedFields.error.flatten().fieldErrors }
  }

  try {
    await db.insert(reviewers).values(validatedFields.data)
    return { message: "success" }
  } catch (error) {
    console.error('Failed to add reviewer:', error)
    return { error: 'Failed to add reviewer. Please try again.' }
  }
}

const finalSubmissionSchema = z.object({
  funded: z.enum(["yes", "no"], {
    required_error: "Funding status is required",
  }).transform(val => val === "yes"),
  ethical: z.enum(["yes", "no"], {
    required_error: "Ethical clearance status is required",
  }).transform(val => val === "yes"),
  consent: z.enum(["yes", "no"], {
    required_error: "Informed consent status is required",
  }).transform(val => val === "yes"),
  human: z.enum(["yes", "no"], {
    required_error: "Human part inclusion status is required",
  }).transform(val => val === "yes"),
  founders: z.string().optional(),
  ethicalReference: z.string().optional()
})

export async function submitAction(_: unknown, formData: FormData) {
  const data = Object.fromEntries(formData.entries())
  const result = finalSubmissionSchema.safeParse(data)

  const others = formData.get('others')?.toString()
  if (!others) return { message: "Failed to submit" }

  const metadataValidations = safeParse({
    input: new URLSearchParams(others),
    schema: metadataSchema
  })

  const reviewerValidations = safeParse({
    input: new URLSearchParams(others),
    schema: z.object({
      reviewers: z.array(reviewerSchema)
    })
  })
  const articleSubmitionValidations = safeParse({
    input: new URLSearchParams(others),
    schema: articleSubmitionSchema
  })
  const filesValidations = safeParse({
    input: new URLSearchParams(others),
    schema: filesSchema
  })
  const contributorValidations = safeParse({
    input: new URLSearchParams(others),
    schema: z.object({
      contributors: z.array(contributorFormSchema),
    })
  })

  if (!metadataValidations.success) {
    console.error(metadataValidations.error.errors)
    return
  }
  if (!reviewerValidations.success) {
    console.error(reviewerValidations.error.errors)
    return
  }
  if (!articleSubmitionValidations.success) {
    console.error(articleSubmitionValidations.error.errors)
    return
  }
  if (!filesValidations.success) {
    console.error(filesValidations.error.errors)
    return
  }
  if (!contributorValidations.success) {
    console.error(contributorValidations.error.errors)
    return
  }
  if (!result.success) {
    console.error(result.error.errors)
    return
  }
  try {
    await db.transaction(async (trx) => {

      await trx.insert(metadata).values(metadataValidations.data)
      await trx.insert(reviewers).values(reviewerValidations.data.reviewers)
      await trx.insert(articleSubmissions).values(articleSubmitionValidations.data)
      await trx.insert(files).values(filesValidations.data.files)
      await trx.insert(contributors).values(contributorValidations.data.contributors)
      await trx.insert(finalSubmissions).values(result.data)

      console.log({ message: "success" })
      return { message: "success" }
    })
  } catch (error) {
    console.error(error)
    return { message: "Failed to submit" }

  }

}

