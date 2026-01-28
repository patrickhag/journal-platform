import { auth } from '@/auth';

import Metadata from '@/components/articles/Metadata';
import Reviewer from '@/components/articles/Reviewer';
import { articleSubmissions, files, reviewers } from '@/db/schema';
import { db } from '@/db/db';
import { eq } from 'drizzle-orm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import GoBackButton from '@/components/articles/GoBackButton';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { AssignOrRejectComponent } from '@/components/articles/AssignOrReject';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';
import withPermissions from '@/components/WithPermission';
import { FinalSubmissionCardWithPermissions } from './components/AddsOnInformationExample';
import { AssignedReviewersWithPermissions } from './components/AssignedReviewers';
import ConditionalRender from '@/components/ConditionalRender';
import FilesClient from '@/components/articles/FilesClient';
import React from 'react';

async function page({ params }: { params: Promise<{ articleId: string }> }) {
  const session = await auth();
  const { articleId } = await params;

  const article = await db.query.articleSubmissions.findFirst({
    where: eq(articleSubmissions.id, articleId),
    with: {
      user: true,
    },
  });

  if (!article) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 text-center italic text-gray-600">
        This article was not found.
      </div>
    );
  }

  const currentUserRole = session?.user?.role;

  const reviewrs = await db
    .select()
    .from(reviewers)
    .where(eq(reviewers.articleId, articleId));

  const filesData = await db
    .select()
    .from(files)
    .where(eq(files.articleId, articleId));

  return (
    <>
      <div className="container mx-auto p-6">
        <div className="flex justify-between">
          <GoBackButton />
          <ArticleLinksPermission
            articleId={articleId}
            role={
              currentUserRole as
                | 'NORMAL_USER'
                | 'CHIEF_EDITOR'
                | 'REVIEWER'
                | 'STAFF_EDITOR'
                | 'ASSOCIATE_EDITOR'
            }
            requiredPermissions={['VIEW_ALL_PARTICIPANTS']}
            fallback=""
          />
        </div>
        {/* METADATA & CONTRIBUTORS */}
        <Metadata articleId={articleId} paperId={article?.paperId as string} />

        {/* AUTHOR INFORMATION */}
        <Card className="my-3">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-[#1a237e]">
              Author information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">
                  Fullnames
                </h3>
                <p className="mt-1">
                  {article?.user.firstName} {article?.user.lastName}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">
                  ORCID
                </h3>
                <p className="mt-1">
                  {article?.user.orcid ? (
                    <Link
                      href={article.user.orcid}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={cn(
                        article.user.orcid
                          ? 'text-blue-500 hover:underline'
                          : ''
                      )}
                    >
                      {article.user.orcid}
                    </Link>
                  ) : (
                    'Not provided'
                  )}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">
                  Email
                </h3>
                <p className="mt-1">{article?.user.email}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">
                  Affiliation
                </h3>
                <p className="mt-1">
                  {article?.user.affiliation
                    ? article?.user.affiliation
                    : 'Not provided'}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">
                  Country
                </h3>
                <p className="mt-1">
                  {article?.user.country || 'Not provided'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* FILES */}
        {/* <Files
          articleId={articleId}
          role={currentUserRole!}
          userId={session?.user.id}
          articleStatus={article?.articleStatus as string}
        /> */}

        {/* TODO: - [ ] add the support for reviewing files inside the platform */}
        <FilesClient
          filesData={filesData}
          userId={session?.user.id}
          articleStatus={article?.articleStatus as string}
          articleId={articleId}
        />

        {/* REVIEWERS */}
        {session?.user.role !== 'REVIEWER' && (
          <Card className="my-3">
            <CardHeader>
              <CardTitle className="text-lg text-[#1a237e]">
                Proposed Reviewers
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="flex justify-between">
                {reviewrs.length === 0 && (
                  <p className="text-sm">
                    Author has not proposed any reviewer.
                  </p>
                )}
              </div>
              {/* PROPOSED REVIEWERS */}
              {reviewrs.map((r, index) => (
                <React.Fragment key={r.id}>
                  <Reviewer
                    reviewer={r}
                    index={index}
                    articleId={article?.id as string}
                  />
                  {index !== reviewrs.length - 1 && <Separator />}
                </React.Fragment>
              ))}
            </CardContent>
          </Card>
        )}

        {/* ASSIGNED REVIEWERS - Only visible to STAFF_EDITOR and CHIEF_EDITOR */}
        <AssignedReviewersWithPermissions
          articleId={articleId}
          articleStatus={article.acceptedAt || 'SUBMITTED'}
          userRole={currentUserRole as
            | 'NORMAL_USER'
            | 'CHIEF_EDITOR'
            | 'REVIEWER'
            | 'STAFF_EDITOR'}
          role={
            currentUserRole as
              | 'NORMAL_USER'
              | 'CHIEF_EDITOR'
              | 'REVIEWER'
              | 'STAFF_EDITOR'
          }
          requiredPermissions={['VIEW_ALL_ASSIGNED_REVIEWERS']}
          fallback=""
        />
        <FinalSubmissionCardWithPermissions
          role={
            (currentUserRole ?? 'ADMIN') as
              | 'NORMAL_USER'
              | 'CHIEF_EDITOR'
              | 'REVIEWER'
              | 'STAFF_EDITOR'
          }
          requiredPermissions={['VIEW_ALL_FINAL_FINAL_QUESTIONS']}
          fallback=""
        />
        <ConditionalRender
          status={article?.articleStatus as string}
          hideOn={['PUBLISHED']}
        >
          <AssignOrRejectComponent
            role={
              (currentUserRole ?? 'ADMIN') as
                | 'NORMAL_USER'
                | 'CHIEF_EDITOR'
                | 'REVIEWER'
                | 'STAFF_EDITOR'
            }
            requiredPermissions={['REJECT_ARTICLE']}
            fallback=""
            articleId={articleId}
          />
        </ConditionalRender>
      </div>
    </>
  );
}

const ArticleLinks = ({ articleId }: { articleId: string }) => (
  <div className="flex gap-2">
    <Link href={`/articles/reviews/${articleId}`}>
      <Button
        size="sm"
        className="gap-1 flex items-center hover:underline"
        variant={'outline'}
      >
        Reviews
        <ChevronRight className="w-2 h-2" />
      </Button>
    </Link>
    <Link href={`/articles/all-participants/${articleId}`}>
      <Button
        size="sm"
        className="gap-1 flex items-center hover:underline"
        variant={'outline'}
      >
        All Participants
        <ChevronRight className="w-2 h-2" />
      </Button>
    </Link>
  </div>
);

const ArticleLinksPermission = withPermissions(ArticleLinks);

export default page;
