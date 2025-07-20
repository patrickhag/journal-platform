import { auth } from '@/auth';
import { db } from '@/db/db';
import { files, metadata } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

type ParamType = {
  id: string;
};

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<ParamType> }
) {
  try {
    const session = await auth();
    const { id } = await params;

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { title, prefix, subtitle, abstract, topics } = await req.json();
    const updatedMetadata = await db
      .update(metadata)
      .set({
        abstract: abstract,
        title: title,
        prefix: prefix,
        subtitle: subtitle,
        topics: topics,
      })
      .where(eq(metadata.articleId, id))
      .returning();

    if (updatedMetadata.length > 0) {
      return NextResponse.json({
        message: 'Metadata updated successfully',
        status: 200,
      });
    }

    return NextResponse.json({ error: 'Metadata not found' }, { status: 404 });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<ParamType> }
) {
  try {
    const { id: articleId } = await params;

    const { updatedFiles, userId } = await req.json();

    for (const file of updatedFiles) {
      const updatedFileInfo = await db
        .insert(files)
        .values({
          userId,
          publicId: file.publicId,
          originalName: file.originalName,
          resourceType: file.resourceType,
          articleId: articleId,
        })
        .returning();

      if (updatedFileInfo.length > 0) {
        return NextResponse.json({
          message: 'Files info updated successfully',
          status: 200,
        });
      }
    }
    return NextResponse.json({ error: 'Metadata not found' }, { status: 404 });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }
}
