import React from 'react';
import { articleSubmissions, contributors, db, metadata } from '@/db/schema';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { eq } from 'drizzle-orm';
import { USER_ROLE } from '@/lib/roles';
import { auth } from '@/auth';
import EditMetadata from './EditMetadata';

export default async function Metadata({
  articleId,
}: {
  articleId: string;
  role: USER_ROLE;
}) {
  const metas = await db
    .select()
    .from(metadata)
    .where(eq(metadata.articleId, articleId))
    .limit(1);

  const meta = metas[0];

  const foundContributors = await db
    .select()
    .from(contributors)
    .where(eq(contributors.articleId, articleId));

  const comments = await db
    .select({
      commentsForEditor: articleSubmissions.commentsForEditor,
    })
    .from(articleSubmissions)
    .where(eq(articleSubmissions.id, articleId))
    .limit(1);

  const comment = comments[0];

  if (!meta) return undefined;

  const session = await auth();
  const userId = session?.user.id;

  return (
    <article>
      <Card>
        <div className="flex justify-between">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              Article information
            </CardTitle>
          </CardHeader>
          {userId === meta.userId && (
            <EditMetadata
              meta={{
                ...meta,
                subtitle: meta.subtitle ?? '',
              }}
              articleId={articleId}
            />
          )}
        </div>
        <CardContent className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">
              Title of the manuscript
            </h3>
            <p className="mt-1">{meta.title}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">
              Subtitle of the manuscript
            </h3>
            <p className="mt-1">{meta.subtitle}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">
              Abstract
            </h3>
            <div
              className="mt-1"
              dangerouslySetInnerHTML={{ __html: meta.abstract }}
            />
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground text-gray-600">
              Comments for the editor
            </h3>
            <div
              className="mt-1"
              dangerouslySetInnerHTML={{ __html: comment.commentsForEditor }}
            />
          </div>
        </CardContent>
      </Card>
      {foundContributors.length > 0 && (
        <Card className="my-3">
          <div className="flex justify-between">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">
                Contributors
              </CardTitle>
            </CardHeader>
          </div>
          <CardContent>
            <div className="space-y-2">
              {foundContributors.map((c) => (
                <div key={c.id} className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">
                      Names
                    </h3>
                    <p className="my-2">
                      {c.salutation} {c.name}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">
                      Contributor&apos;s role
                    </h3>
                    <p className="my-2 uppercase">{c.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </article>
  );
}
