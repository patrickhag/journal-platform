import { USER_ROLE } from '@/lib/roles';
import React from 'react';
import { Button } from '../ui/button';
import withPermissions from '../WithPermission';
import { articleFiles, db, people, reviewFiles, reviews, users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { Card, CardContent, CardHeader } from '../ui/card';

const Reviews = async ({
  role,
  articleId,
}: {
  role: USER_ROLE;
  articleId: string;
}) => {
  const reviewerReviews = await db
    .select()
    .from(reviews)
    .where(eq(reviews.articleId, articleId));
  return (
    <Card className="space-y-4 my-4">
      <CardHeader>
        <h3 className="font-bold text-xl">Reviews</h3>
      </CardHeader>
      <CardContent>

        {reviewerReviews.length <= 0 ? (
          <p>No reviews given</p>
        ) : (
          <>
            {reviewerReviews.map((r) => (
              <div key={r.id} className="space-y-2">
                <p className="text-gray-600">{r.message}</p>
                <h3 className="font-bold text-xl">Files</h3>
                <FilesRewiews reviewId={r.id}
                />
                <div className="flex items-center justify-between">
                  <User id={r.reviewerId} />
                  <ControlReviewsWithPermissions
                    role={role}
                    requiredPermissions={['MANAGE_REVIEWERS']}
                    fallback={<></>}
                  />
                </div>
              </div>
            ))}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default Reviews;
const FilesRewiews = async ({ reviewId }: { reviewId: string }) => {
  const reviews = await db.select().from(reviewFiles).where(eq(reviewFiles.reviewId, reviewId))
  return <ul>
    {reviews.map((f) => (
      <li key={f.id}>
        <FileItem fileId={f.fileId} />
      </li>
    ))}
  </ul>
}

const FileItem = async ({ fileId }: { fileId: string }) => {
  const file = await db.select().from(articleFiles).where(eq(articleFiles.id, fileId)).limit(1)
  return <a href={file[0].publicId}>
    {file[0].publicId.split('/').at(-1)}
  </a>
}
const User = async ({ id }: { id: string }) => {
  const user = await db
    .select({
      firstName: people.firstName,
      lastName: people.lastName,
    })
    .from(users)
    .leftJoin(people, eq(users.personId, people.id))
    .where(eq(users.id, id))
    .limit(1);
  return (
    <span className="text-sm text-gray-500">
      {user[0].firstName} {user[0].lastName}
    </span>
  );
};

const ReviewersControl = () => (
  <div className="space-x-2">
    <Button variant="link" className="text-blue-500 hover:text-blue-600">
      Hide
    </Button>
    <Button variant="link" className="text-red-500 hover:text-red-600">
      Delete
    </Button>
  </div>
);

const ControlReviewsWithPermissions = withPermissions(ReviewersControl);
