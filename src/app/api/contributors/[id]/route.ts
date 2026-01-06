import { auth } from '@/auth';
import { db } from '@/db/db';
import { contributors, articleSubmissions } from '@/db/schema';
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

    // Verify the contributor exists and belongs to an article owned by the user
    const contributor = await db.query.contributors.findFirst({
      where: eq(contributors.id, id),
      with: {
        article: {
          columns: {
            userId: true,
            articleStatus: true,
          },
        },
      },
    });

    if (!contributor) {
      return NextResponse.json(
        { error: 'Contributor not found' },
        { status: 404 }
      );
    }

    // Check if user owns the article and article is not published
    if (
      contributor.article?.userId !== session.user.id ||
      contributor.article?.articleStatus === 'PUBLISHED'
    ) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const {
      name,
      salutation,
      email,
      country,
      orcid,
      affiliation,
      bio,
      role,
    } = await req.json();

    const updatedContributor = await db
      .update(contributors)
      .set({
        name,
        salutation,
        email,
        country,
        orcid,
        affiliation,
        bio,
        role,
      })
      .where(eq(contributors.id, id))
      .returning();

    if (updatedContributor.length > 0) {
      return NextResponse.json({
        message: 'Contributor updated successfully',
        status: 200,
      });
    }

    return NextResponse.json(
      { error: 'Failed to update contributor' },
      { status: 500 }
    );
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<ParamType> }
) {
  try {
    const session = await auth();
    const { id: articleId } = await params;

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify the article exists and is owned by the user
    const article = await db.query.articleSubmissions.findFirst({
      where: eq(articleSubmissions.id, articleId),
      columns: {
        userId: true,
        articleStatus: true,
      },
    });

    if (!article) {
      return NextResponse.json(
        { error: 'Article not found' },
        { status: 404 }
      );
    }

    // Check if user owns the article and article is not published
    if (
      article.userId !== session.user.id ||
      article.articleStatus === 'PUBLISHED'
    ) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const {
      name,
      salutation,
      email,
      country,
      orcid,
      affiliation,
      bio,
      role,
    } = await req.json();

    const newContributor = await db
      .insert(contributors)
      .values({
        name,
        salutation,
        email,
        country,
        orcid,
        affiliation,
        bio,
        role,
        articleId,
      })
      .returning();

    if (newContributor.length > 0) {
      return NextResponse.json({
        message: 'Contributor added successfully',
        status: 200,
      });
    }

    return NextResponse.json(
      { error: 'Failed to add contributor' },
      { status: 500 }
    );
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

