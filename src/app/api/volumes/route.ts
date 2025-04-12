import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db/db';
import { volumes } from '@/db/schema';
import { auth } from '@/auth';
import { eq, or } from 'drizzle-orm';

export async function GET(_req: NextRequest) {
  try {
    const session = await auth();

    if (
      !(session?.user.role === 'ADMIN' || session?.user.role === 'CHIEF_EDITOR')
    ) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const allVolumes = await db.query.volumes.findMany({
      columns: {
        id: true,
        volumeNumber: true,
        title: true,
        description: true,
        year: true,
        status: true,
      },
      with: {
        issues: {
          columns: {
            id: true,
            title: true,
            description: true,
            status: true,
            issueNumber: true,
            publicationDate: true,
          },
          with: {
            articles: {
              columns: {
                id: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json(allVolumes);
  } catch (error) {
    console.error('Error creating volume:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { volumeNumber, title, description, year, status } = body;

    if (!volumeNumber || !year) {
      return NextResponse.json(
        { message: 'Volume number and year are required' },
        { status: 400 }
      );
    }

    const session = await auth();

    if (
      !(session?.user.role === 'ADMIN' || session?.user.role === 'CHIEF_EDITOR')
    ) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const existingVolume = await db.query.volumes.findFirst({
      where: or(eq(volumes.volumeNumber, volumeNumber), eq(volumes.year, year)),
    });

    if (existingVolume) {
      return NextResponse.json(
        { message: 'Volume with this number already exists' },
        { status: 409 }
      );
    }

    if (volumeNumber)
      await db
        .insert(volumes)
        .values({
          volumeNumber,
          title,
          description,
          year,
          status,
        })
        .returning();

    return NextResponse.json(
      { message: 'Volumen created successfully!' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating volume:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
