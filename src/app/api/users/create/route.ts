import { auth } from '@/auth';
import { db } from '@/db/db';
import { userRoles, users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { formatRoleText } from '@/lib/utils';
import { revalidatePath } from 'next/cache';

export async function POST(req: NextRequest) {
  try {
    const session = await auth();

    if (session?.user.role !== 'CHIEF_EDITOR') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const {
      firstName,
      lastName,
      email,
      affiliation,
      country,
      role,
      isPartOfEditorialBoard,
      prefix,
      orcid,
      bio,
      expertise,
    } = body;

    // Check if user already exists
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (existingUser.length > 0) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      );
    }

    // Generate a temporary password (user will need to reset it)
    const tempPassword = `Temp@${Math.random().toString(36).slice(-8)}`;
    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    // Create the user
    const newUser = await db
      .insert(users)
      .values({
        firstName,
        lastName,
        email,
        affiliation,
        country,
        password: hashedPassword,
        isPartOfEditorialBoard: isPartOfEditorialBoard || false,
        prefix,
        orcid,
        bio,
        expertise,
        isActive: true,
      })
      .returning({ id: users.id });

    // Create the user role
    await db.insert(userRoles).values({
      userId: newUser[0].id,
      role: formatRoleText(role),
    });

    revalidatePath('/editor/users');

    return NextResponse.json(
      { message: 'User created successfully' },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error creating user:', error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    } else {
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  }
}
