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
    sponsors,
    paperTemplate,
    copyrightTemplate,
    humanPartsConsent,
  } = body;

  try {
    const existingManual = await db.select().from(manuals).limit(1);

    if (existingManual.length > 0) {
      // Merge generalSettings with existing if updating
      let mergedGeneralSettings = generalSettings;
      if (generalSettings !== undefined) {
        const existingGeneralSettings = existingManual[0]
          .generalSettings as Record<string, unknown> | null;
        mergedGeneralSettings = {
          ...(existingGeneralSettings || {}),
          ...generalSettings,
        };
      }

      await db.update(manuals).set({
        guidelines: guidelines ?? existingManual[0].guidelines,
        instructionToAuthors:
          instructionToAuthors ?? existingManual[0].instructionToAuthors,
        generalSettings:
          mergedGeneralSettings ?? existingManual[0].generalSettings,
        policies: policies ?? existingManual[0].policies,
        aboutUs: aboutUs ?? existingManual[0].aboutUs,
        aimsNscope: aimsNscope ?? existingManual[0].aimsNscope,
        termsNconditions:
          termsNconditions ?? existingManual[0].termsNconditions,
        sponsors: sponsors ?? existingManual[0].sponsors,
        paperTemplate: paperTemplate ?? existingManual[0].paperTemplate,
        copyrightTemplate:
          copyrightTemplate ?? existingManual[0].copyrightTemplate,
        humanPartsConsent:
          humanPartsConsent ?? existingManual[0].humanPartsConsent,
      } as typeof manuals.$inferInsert);

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
          sponsors,
          paperTemplate,
          copyrightTemplate,
          humanPartsConsent,
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
