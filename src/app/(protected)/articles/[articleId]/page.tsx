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
import AddReviewerModal from '@/components/upload/AddReviewerModal';
import AssignRevieweModal from './components/AssignReviewersModal';

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
          <ReviewsArticleLinkPermission
            articleId={articleId}
            role={
              currentUserRole as
                | 'NORMAL_USER'
                | 'CHIEF_EDITOR'
                | 'REVIEWER'
                | 'STAFF_EDITOR'
            }
            requiredPermissions={['VIEW_REVIEWS']}
            fallback={<></>}
          />
          <AllParticipantsLinkPermission
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
        {/* metadata & contributors */}
        <Metadata articleId={articleId} role={currentUserRole!} />

        {/* author info */}
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

        {/* files */}
        <Files
          articleId={articleId}
          role={currentUserRole!}
          userId={session?.user.id}
          articleStatus={article?.articleStatus as string}
        />

        {/* reviewers */}
        {session?.user.role !== 'REVIEWER' && (
          <Card className="my-3">
            <CardHeader>
              <CardTitle className="text-[#1a237e]">
                Proposed Reviewers
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex justify-between">
                {reviewrs.length === 0 && (
                  <p className="text-sm">
                    Author has not proposed any reviewer.
                  </p>
                )}
                <AssignReviewerLinkPermission
                  requiredPermissions={['ASSIGN_REVIEWERS']}
                  role={
                    currentUserRole as
                      | 'NORMAL_USER'
                      | 'CHIEF_EDITOR'
                      | 'REVIEWER'
                      | 'STAFF_EDITOR'
                  }
                  fallback={<></>}
                />
                <AddReviewersLinkPermission
                  requiredPermissions={['INVITE_REVIEWERS']}
                  role={
                    currentUserRole as
                      | 'NORMAL_USER'
                      | 'CHIEF_EDITOR'
                      | 'REVIEWER'
                      | 'STAFF_EDITOR'
                  }
                  fallback={<></>}
                />
              </div>
              <Separator />
              {/* PROPOSED REVIEWERS */}
              {reviewrs.map((r, index) => (
                <Reviewer
                  reviewer={r}
                  index={index}
                  key={r.id}
                  articleId={article?.id as string}
                />
              ))}
            </CardContent>
          </Card>
        )}
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

const ReviewsArticleLink = ({ articleId }: { articleId: string }) => (
  <Button variant="link" size="sm" className="gap-1 flex items-center">
    <Link href={`/articles/reviews/${articleId}`}> Reviews</Link>
    <ChevronRight className="w-2 h-2" />
  </Button>
);

const AllParticipantsLink = ({ articleId }: { articleId: string }) => (
  <Button variant="link" size="sm" className="gap-1 flex items-center">
    <Link href={`/articles/all-participants/${articleId}`}>
      All Participants
    </Link>
    <ChevronRight className="w-2 h-2" />
  </Button>
);

const ReviewsArticleLinkPermission = withPermissions(ReviewsArticleLink);

const AllParticipantsLinkPermission = withPermissions(AllParticipantsLink);

const AssignReviewerLink = () => <AssignRevieweModal />;

const AddReviewersLink = () => (
  <AddReviewerModal typeOfPage="review" autoSave />
);

const AddReviewersLinkPermission = withPermissions(AddReviewersLink);

const AssignReviewerLinkPermission = withPermissions(AssignReviewerLink);

export default page;
