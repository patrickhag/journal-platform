import React from 'react';
import { articleSubmissions, contributors, metadata } from '@/db/schema';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { eq } from 'drizzle-orm';
import { USER_ROLE } from '@/lib/roles';
import { auth } from '@/auth';
import EditMetadata from './EditMetadata';
import { db } from '@/db/db';
import { StatusBadge } from '../status-badge';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export default async function Metadata({
  articleId,
}: {
  articleId: string;
  role: USER_ROLE;
}) {
  const meta = await db.query.metadata.findFirst({
    columns: {
      title: true,
      subtitle: true,
      abstract: true,
      userId: true,
      prefix: true,
      topics: true,
    },
    with: {
      article: {
        columns: {
          articleStatus: true,
          section: true,
          commentsForEditor: true,
          createdAt: true,
        },
      },
    },
    where: eq(metadata.articleId, articleId),
  });

  const foundContributors = await db
    .select()
    .from(contributors)
    .where(eq(contributors.articleId, articleId));

  if (!meta) return undefined;

  const session = await auth();
  const userId = session?.user.id;

  return (
    <article>
      <Card>
        <div className="flex justify-between">
          <CardHeader>
            <div className="flex items-center">
              <CardTitle className="text-lg font-semibold">
                Article information{' '}
              </CardTitle>
              <StatusBadge
                status={meta.article?.articleStatus || 'Submitted'}
                className="ml-2"
              />
            </div>
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
          <div className="grid gap-8 sm:grid-cols-2">
            <div>
              <div className="mb-4">
                <h3 className="text-sm font-medium text-muted-foreground">
                  Title of the manuscript
                </h3>
                <p className="mt-1">{meta.title}</p>
              </div>
              <div className="mb-4">
                <h3 className="text-sm font-medium text-muted-foreground">
                  Subtitle of the manuscript
                </h3>
                <p className="mt-1">{meta.subtitle}</p>
              </div>
              <div className="mb-4">
                <h3 className="text-sm font-medium text-muted-foreground">
                  Abstract
                </h3>
                <div
                  className="mt-1"
                  dangerouslySetInnerHTML={{
                    __html: meta.abstract
                      .replace(/<pre>/g, '<p>')
                      .replace(/<\/pre>/g, '</p>'),
                  }}
                />
              </div>
              <div className="mb-4">
                <h3 className="text-sm font-medium text-muted-foreground text-gray-600">
                  Comments for the editor
                </h3>
                {meta.article?.commentsForEditor ? (
                  <div
                    className="mt-1"
                    dangerouslySetInnerHTML={{
                      __html: meta.article?.commentsForEditor
                        .replace(/<pre>/g, '<p>')
                        .replace(/<\/pre>/g, '</p>'),
                    }}
                  />
                ) : (
                  <p className="mt-1">Not provided</p>
                )}
              </div>
            </div>
            <div>
              <div className="mb-4">
                <h3 className="text-sm font-medium text-muted-foreground">
                  Created at
                </h3>
                <p className="mt-1">{meta.article?.createdAt || ''}</p>
              </div>
              <div className="mb-4">
                <h3 className="text-sm font-medium text-muted-foreground">
                  Section of the manuscript
                </h3>
                <p className="mt-1">{meta.article?.section || ''}</p>
              </div>
              <div className="mb-4">
                <h3 className="text-sm font-medium text-muted-foreground">
                  Keywords
                </h3>
                <p className="mt-1">
                  {meta.topics.join(', ') || 'No keywords provided'}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      {foundContributors.length > 0 && (
        <Card className="my-3">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              Contributors
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {foundContributors.map((c) => (
                <div key={c.id} className="grid gap-4 sm:grid-cols-2 mb-5">
                  <div>
                    <div className="mb-4">
                      <h3 className="text-sm font-medium text-muted-foreground">
                        Names
                      </h3>
                      <p className="my-1">{c.name}</p>
                    </div>
                    <div className="mb-4">
                      <h3 className="text-sm font-medium text-muted-foreground">
                        Contributor&apos;s role
                      </h3>
                      <p className="my-1 uppercase">{c.role}</p>
                    </div>
                    <div className="mb-4">
                      <h3 className="text-sm font-medium text-muted-foreground">
                        Biography
                      </h3>
                      <p className="my-1">{c.bio || 'Not provided'}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">
                        Country
                      </h3>
                      <p className="my-1">{c.country || 'Not provided'}</p>
                    </div>
                  </div>
                  <div>
                    <div className="mb-4">
                      <h3 className="text-sm font-medium text-muted-foreground">
                        ORCID
                      </h3>
                      <p className="my-1">
                        {c.orcid ? (
                          <Link
                            href={`https://orcid.org/${c.orcid}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={cn(
                              c.orcid
                                ? 'text-blue-500 hover:underline'
                                : 'text-muted-foreground'
                            )}
                          >
                            https://orcid.org/{c.orcid}
                          </Link>
                        ) : (
                          'Not provided'
                        )}
                      </p>
                    </div>
                    <div className="mb-4">
                      <h3 className="text-sm font-medium text-muted-foreground">
                        Email
                      </h3>
                      <p className="my-1">{c.email || 'Not provided'}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">
                        Affiliation
                      </h3>
                      <p className="my-1">{c.affiliation || 'Not provided'}</p>
                    </div>
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
