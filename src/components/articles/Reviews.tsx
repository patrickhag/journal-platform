import React from 'react';
import { Button } from '../ui/button';
import { db, reviews, users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { EyeIcon, FileText } from 'lucide-react';
import Link from 'next/link';
import { Separator } from '../ui/separator';
import { StatusBadge } from '../status-badge';
import { ArticleStatus } from '@/lib/consts';

const Reviews = async ({ articleId }: { articleId: string }) => {
  const reviewerReviews = await db
    .select()
    .from(reviews)
    .where(eq(reviews.articleId, articleId));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Reviews</CardTitle>
      </CardHeader>

      <CardContent>
        {reviewerReviews.map((r, index) => (
          <React.Fragment key={r.id}>
            <div className="mb-6">
              <div className="flex justify-between items-center">
                <p className="text-sm text-muted-foreground">
                  Reviewer&apos;s feedback
                </p>
                {r.status ? (
                  <StatusBadge status={r.status as ArticleStatus} />
                ) : (
                  'Not provided'
                )}
              </div>
              <p className="mt-2 whitespace-pre-line">
                {r.message?.trim() || 'Not provided'}
              </p>
            </div>

            <div className="mb-6">
              <p className="text-sm text-muted-foreground mb-3">
                Annotated file
              </p>
              {r.fileIds?.length > 0 ? (
                r.fileIds.map((f) => (
                  <div
                    key={f}
                    className="flex items-center justify-between p-3 border rounded-lg mb-2"
                  >
                    <div className="flex items-center space-x-4">
                      <FileText className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Reviewed file</p>
                        <p className="text-sm text-muted-foreground">12kb</p>
                      </div>
                    </div>
                    <Button variant="secondary" size="sm" asChild>
                      <Link href={f} target="_blank" rel="noopener noreferrer">
                        <span className="flex items-center">
                          <EyeIcon className="mr-2 text-gray-600" />
                          View
                        </span>
                      </Link>
                    </Button>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">Not provided</p>
              )}
            </div>

            <div className="mb-4">
              <p className="text-sm text-muted-foreground mb-1">Reviewer</p>
              <React.Suspense fallback={<p>Loading...</p>}>
                <User id={r.userId} />
              </React.Suspense>
            </div>

            {index < reviewerReviews.length - 1 && (
              <Separator className="my-6" />
            )}
          </React.Fragment>
        ))}
      </CardContent>
    </Card>
  );
};

export default Reviews;

const User = async ({ id }: { id: string }) => {
  const user = await db
    .select({
      firstName: users.firstName,
      lastName: users.lastName,
    })
    .from(users)
    .where(eq(users.id, id))
    .limit(1);

  const userData = user[0];
  const fullName =
    userData?.firstName || userData?.lastName
      ? `${userData.firstName || ''} ${userData.lastName || ''}`.trim()
      : 'Not provided';

  return <span>{fullName}</span>;
};
