import { auth } from '@/auth';
import { db } from '@/db/db';
import { volumes } from '@/db/schema';
import { and, eq, ne } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

type Params = { id: string };

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<Params> }
) {
  try {
    const session = await auth();

    if (session?.user.role !== 'CHIEF_EDITOR') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: volumeId } = await params;

    if (!volumeId) {
      return NextResponse.json(
        { message: 'Issue ID is required' },
        { status: 400 }
      );
    }

    const isIssueDeleted = await db
      .delete(volumes)
      .where(eq(volumes.id, volumeId))
      .returning();

    if (isIssueDeleted.length === 0) {
      return NextResponse.json(
        { message: 'Volume not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Volume deleted successfully!' });
  } catch (error) {
    console.error('Error deleting issue:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<Params> }
) {
  try {
    const session = await auth();

    if (
      !(session?.user.role === 'ADMIN' || session?.user.role === 'CHIEF_EDITOR')
    ) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: volumeId } = await params;
    const { volumeNumber, title, description, year, status } = await req.json();
    const parsedVolumeNumber = Number(volumeNumber);
    const parsedYear = Number(year);

    if (!volumeId) {
      return NextResponse.json(
        { message: 'Volume ID is required' },
        { status: 400 }
      );
    }

    if (!Number.isFinite(parsedVolumeNumber) || !Number.isFinite(parsedYear)) {
      return NextResponse.json(
        { message: 'Volume number and year are required' },
        { status: 400 }
      );
    }

    const existingVolume = await db.query.volumes.findFirst({
      where: and(
        eq(volumes.year, parsedYear),
      ),
    });

    if (existingVolume) {
      return NextResponse.json(
        { message: 'Volume with this number already exists!' },
        { status: 409 }
      );
    }

    const updatedVolume = await db
      .update(volumes)
      .set({
        volumeNumber: parsedVolumeNumber,
        title,
        description,
        year: parsedYear,
        status,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(volumes.id, volumeId))
      .returning();

    if (updatedVolume.length === 0) {
      return NextResponse.json(
        { message: 'Volume not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Volume updated successfully!' });
  } catch (error) {
    console.error('Error updating volume:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
