'use server';

import { db } from '@/db/db';
import { users } from '@/db/schema';
import { loginSchema } from '@/schemas/auth.schema';
import bcrypt from 'bcrypt';
import { eq } from 'drizzle-orm';
import { createSession } from './createSession';
import { FormState } from '@/types';

export async function authenticate(
  state: FormState,
  formData: FormData
): Promise<FormState> {
  // 1. Validate form fields
  const validatedFields = loginSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  });

  const errorMessage = { message: 'Invalid login credentials.' };

  // If any form fields are invalid, return early
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  // 2. Query the database for the user with the given email
  const user = await db.query.users.findFirst({
    where: eq(users.email, validatedFields.data.email),
  });

  // If user is not found, return early
  if (!user) {
    return errorMessage;
  }
  // 3. Compare the user's password with the hashed password in the database
  const passwordMatch = await bcrypt.compare(
    validatedFields.data.password,
    user.password as string
  );

  // If the password does not match, return early
  if (!passwordMatch) {
    console.log('damn 😤');
    return errorMessage;
  }

  // 4. If login successful, create a session for the user and redirect
  const userId = user.id.toString();
  const userRole = user.role.toString();
  await createSession({ userId, userRole });
}
