import { auth } from '@/auth';

import Files from '@/components/articles/Files';
import Metadata from '@/components/articles/Metadata';
import Reviewer from '@/components/articles/Reviewer';
import { articleSubmissions, reviewers } from '@/db/schema';
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
import { AssignRevieweModalWithPermission } from './components/AssignReviewersModal';
import { FinalSubmissionCardWithPermissions } from './components/AddsOnInformationExample';

async function page({ params }: { params: Promise<{ articleId: string }> }) {
  const session = await auth();
  const { articleId } = await params;

  const article = await db.query.articleSubmissions.findFirst({
    where: eq(articleSubmissions.id, articleId),
    with: {
      user: true,
    },
  });

  const currentUserRole = session?.user?.role;

  const reviewrs = await db
    .select()
    .from(reviewers)
    .where(eq(reviewers.articleId, articleId));

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
        <Metadata articleId={articleId} role={currentUserRole!} />

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
        <Files
          articleId={articleId}
          role={currentUserRole!}
          userId={session?.user.id}
          articleStatus={article?.articleStatus as string}
        />

        {/* REVIEWERS */}
        {session?.user.role !== 'REVIEWER' && (
          <Card className="my-3">
            <div className="flex justify-between items-center">
              <CardHeader>
                <CardTitle className="text-lg text-[#1a237e]">
                  Proposed Reviewers
                </CardTitle>
              </CardHeader>
              <AssignRevieweModalWithPermission
                requiredPermissions={['ASSIGN_REVIEWERS']}
                role={
                  currentUserRole as
                    | 'NORMAL_USER'
                    | 'CHIEF_EDITOR'
                    | 'REVIEWER'
                    | 'STAFF_EDITOR'
                }
                fallback={''}
              />
            </div>
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
                <>
                  <Reviewer
                    reviewer={r}
                    index={index}
                    key={r.id}
                    articleId={article?.id as string}
                  />
                  {index !== reviewrs.length - 1 && <Separator />}
                </>
              ))}
            </CardContent>
          </Card>
        )}
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
        {article?.articleStatus !== 'PUBLISHED' && (
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
        )}
      </div>
    </>
  );
}

const ArticleLinks = ({ articleId }: { articleId: string }) => (
  <div className="flex gap-2">
    <Link
      href={`/articles/reviews/${articleId}`}
      className="hover:underline cursor-pointer"
    >
      <Button size="sm" className="gap-1 flex items-center">
        Reviews
        <ChevronRight className="w-2 h-2" />
      </Button>
    </Link>
    <Link
      href={`/articles/all-participants/${articleId}`}
      className="hover:underline cursor-pointer"
    >
      <Button size="sm" className="gap-1 flex items-center">
        All Participants
        <ChevronRight className="w-2 h-2" />
      </Button>
    </Link>
  </div>
);

const ArticleLinksPermission = withPermissions(ArticleLinks);

export default page;
