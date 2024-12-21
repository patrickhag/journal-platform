'use server';

import { signIn } from '@/auth';
import { db, people, users, } from '@/db/schema';
import { registerSchema } from '@/schemas/auth.schema';
import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';
import { AuthError } from 'next-auth';
import { redirect, RedirectType } from 'next/navigation';
import type z from 'zod';

export async function register(
  _prevState:
    | { message: string; data?: Partial<z.infer<typeof registerSchema>> }
    | undefined,
  formData: z.infer<typeof registerSchema>
) {
  const register = registerSchema.safeParse(formData);

  if (register.error)
    return { message: register.error.errors[0].message, data: formData };
  try {

    const existingUser = await db
      .select()
      .from(users)
      .leftJoin(people, eq(users.personId, people.id))
      .where(eq(people.email, register.data.email))
      .limit(1);

    if (existingUser.length > 0) {
      return { message: 'Email already in use.', data: register.data };
    }

    const hashedPassword = bcrypt.hashSync(register.data.password);

    const user = {
      ...register.data,
      password: hashedPassword,
    };

    await db.transaction(async (tx) => {
      const [person] = await tx.insert(people).values(user).returning()

      console.log(person)
      await tx.insert(users).values({ personId: person.id, password: hashedPassword })
    })
    await signIn('credentials', {
      email: register.data.email,
      password: register.data.password
    });

    // return { message: 'Registration successful', data: register.data };
  } catch (error) {
    // if (error instanceof AuthError) {
    //   switch (error.type) {
    //     case 'CredentialsSignin':
    //       return { message: 'Invalid credentials.' };
    //     default:
    //       return { message: 'Something went wrong during registration.' };
    //   }
    // }
    // return { message: 'An unexpected error occurred during registration.' };


    console.log(error)
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return { message: 'Invalid credentials. Try again!' };
        default:
          return { message: 'Something went wrong during sign-in.' };
      }
    }

    const user = await db
      .select({ role: users.role })
      .from(users)
      .leftJoin(people, eq(users.personId, people.id))
      .where(eq(people.email, register.data.email))
      .limit(1);
    console.log(user)
    if (user[0].role === 'CHIEF_EDITOR' || user[0].role === 'ADMIN') {
      redirect('/editor', RedirectType.replace);
    } else {
      redirect('/submissions', RedirectType.replace);
    }
  }
}
