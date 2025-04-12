import { auth } from '@/auth';
import Files from '@/components/articles/Files';
import Metadata from '@/components/articles/Metadata';
import Reviewer from '@/components/articles/Reviewer';
import { articleSubmissions, reviewers, users } from '@/db/schema';
import { db } from '@/db/db';
import { eq } from 'drizzle-orm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import GoBackButton from '@/components/articles/GoBackButton';
import Reviews from '@/components/articles/Reviews';
import { Separator } from '@/components/ui/separator';
import AddReviewerModal from '@/components/upload/AddReviewerModal';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { AcceptOrRejectComponent } from '@/components/articles/AcceptOrReject';
import { Publish } from '@/components/articles/PublishArticle';

async function page({ params }: { params: Promise<{ articleId: string[] }> }) {
  const parameters = await params;
  const [articleId] = parameters.articleId;
  const userId = (await auth())?.user?.id;

  const foundArticle = await db
    .select()
    .from(articleSubmissions)
    .where(eq(articleSubmissions.id, articleId))
    .limit(1);

  const article = foundArticle[0];
  const session = await auth();

  const currentUserRole = session?.user?.role;

  const author = await db
    .select()
    .from(users)
    .where(eq(users.id, article.userId ?? ''))
    .limit(1);

  const reviewrs = await db
    .select()
    .from(reviewers)
    .where(eq(reviewers.articleId, articleId));

  return (
    <>
      <div className="container mx-auto p-6">
        <GoBackButton />

        <Metadata articleId={articleId} role={currentUserRole!} />

        <Card className="my-3">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
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
                  {author[0].firstName} {author[0].lastName}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">
                  ORCID
                </h3>
                <p className="mt-1">
                  {author[0].orcid ? (
                    <Link
                      href={`https://orcid.org/${author[0].orcid}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={cn(
                        author[0].orcid ? 'text-blue-500 hover:underline' : ''
                      )}
                    >
                      https://orcid.org/{author[0].orcid}
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
                <p className="mt-1">{author[0].email}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">
                  Affiliation
                </h3>
                <p className="mt-1">
                  {author[0].affiliation
                    ? author[0].affiliation
                    : 'Not provided'}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">
                  Country
                </h3>
                <p className="mt-1">{author[0].country}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Files articleId={articleId} role={currentUserRole!} userId={userId!} />
        <Card className="my-3">
          <CardHeader>
            <CardTitle>Reviewers</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {currentUserRole === 'CHIEF_EDITOR' ? (
              <>
                <div className="flex justify-between">
                  {reviewrs.length === 0 ? (
                    <>
                      <p className="text-sm">
                        This user has not proposed any reviewer. Add one
                        instead!
                      </p>
                    </>
                  ) : (
                    <p className="text-sm">Add new reviewers</p>
                  )}
                  <AddReviewerModal typeOfPage="review" autoSave />
                </div>
              </>
            ) : null}
            <Separator />
            {reviewrs.map((r, index) => (
              <Reviewer
                reviewer={r}
                index={index}
                key={r.id}
                article={article.id}
              />
            ))}
          </CardContent>
        </Card>
        <Reviews articleId={articleId} />
        <AcceptOrRejectComponent
          role={currentUserRole ?? 'ADMIN'}
          requiredPermissions={['ACCEPT_ARTICLE', 'REJECT_ARTICLE']}
          fallback=""
          articleId={articleId}
        />
        <Publish
          role={currentUserRole ?? 'ADMIN'}
          requiredPermissions={['PUBLISH_ARTICLES']}
          fallback=""
          articleId={articleId}
          status={article.articleStatus}
        />
      </div>
    </>
  );
}

export default page;
