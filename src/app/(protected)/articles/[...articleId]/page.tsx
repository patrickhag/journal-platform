import { auth } from '@/auth';
import Files from '@/components/articles/Files';
import Metadata from '@/components/articles/Metadata';
import Reviewer from '@/components/articles/Reviewer';
import { articleSubmissions, db, reviewers, users } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import GoBackButton from '@/components/articles/GoBackButton';
import Reviews from '@/components/articles/Reviews';
import { Separator } from '@/components/ui/separator';
import AddReviewerModal from '@/components/upload/AddReviewerModal';
import { ARTICLE_STATUS } from '@/lib/consts';
import { revalidatePath } from 'next/cache';
import withPermissions from '@/components/WithPermission';
import { Button } from '@/components/ui/button';

async function page({
  params,
  searchParams,
}: {
  params: Promise<{ articleId: string[] }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const parameters = await params;
  const [articleId] = parameters.articleId;
  {
    const userId = (await auth())?.user?.id;
    const params = await searchParams;
    const isAcceptingInvite = params.accept_invite?.toString();
    if (isAcceptingInvite && Boolean(isAcceptingInvite) && userId) {
      await db
        .update(reviewers)
        .set({ acceptedInvitation: Boolean(parseInt(isAcceptingInvite)) })
        .where(
          and(eq(reviewers.articleId, articleId), eq(reviewers.userId, userId))
        );
    }
  }
  const articles = await db
    .select()
    .from(articleSubmissions)
    .where(eq(articleSubmissions.id, articleId))
    .limit(1);

  if (articles.length <= 0) return <h1>Article Not Found</h1>;
  const article = articles[0];
  const session = await auth();
  const currentUser = session?.user;
  if (!currentUser) return <h1>Not authenticated</h1>;

  const currentUserRole = session?.user?.role;

  const author = await db
    .select()
    .from(users)
    .where(eq(users.id, articles[0].userId))
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
                  Email
                </h3>
                <p className="mt-1">{author[0].email}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">
                  Affiliation
                </h3>
                <p className="mt-1">{author[0].affiliation}</p>
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
        <Files articleId={articleId} role={currentUserRole} />
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
                  <AddReviewerModal autoSave />
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
        <Reviews articleId={articleId} role={currentUserRole} />
        <Publish
          role={currentUserRole}
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

const PublishArticle = ({
  articleId,
  status,
}: {
  articleId: string;
  status: (typeof ARTICLE_STATUS)[number] | null;
}) => {
  return (
    <form
      className="flex justify-center items-center"
      action={async () => {
        'use server';
        await db
          .update(articleSubmissions)
          .set({
            articleStatus: status === 'Published' ? 'Submitted' : 'Published',
          })
          .where(eq(articleSubmissions.id, articleId));
        revalidatePath('/articles/' + articleId);
      }}
    >
      <Button className="w-4/5 mx-auto bg-green-500 hover:bg-green-600 mt-3">
        {status === 'Published' ? 'Unpublish' : 'Publish'} this article{' '}
      </Button>
    </form>
  );
};
const Publish = withPermissions(PublishArticle);
