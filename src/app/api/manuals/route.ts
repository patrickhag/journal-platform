import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db/db';
import { manuals } from '@/db/schema';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const {
    guidelines,
    policies,
    instructionToAuthors,
    generalSettings,
    aboutUs,
    aimsNscope,
    termsNconditions,
    paperTemplate,
    copyrightTemplate,
  } = body;

  try {
    const existingManual = await db.select().from(manuals).limit(1);

    if (existingManual.length > 0) {
      await db.update(manuals).set({
        guidelines,
        instructionToAuthors,
        generalSettings,
        policies,
        aboutUs,
        aimsNscope,
        termsNconditions,
        copyrightTemplate,
      });

      return NextResponse.json(
        { message: 'Changes updated successfully!' },
        { status: 200 }
      );
    } else {
      await db
        .insert(manuals)
        .values({
          guidelines,
          instructionToAuthors,
          generalSettings,
          policies,
          aboutUs,
          aimsNscope,
          termsNconditions,
          paperTemplate,
          copyrightTemplate,
        })
        .returning();

      return NextResponse.json(
        { message: 'Changes added successfully!' },
        { status: 200 }
      );
    }
  } catch (error) {
    console.error('Error updating/creating manual:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const existingManual = await db.select().from(manuals).limit(1);

    if (existingManual.length > 0) {
      return NextResponse.json(existingManual[0], { status: 200 });
    } else {
      return NextResponse.json({ message: 'No manual found' }, { status: 404 });
    }
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch manual' },
      { status: 500 }
    );
  }
}
