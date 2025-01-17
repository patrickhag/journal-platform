import React from 'react';
import { Button } from '../ui/button';
import { db, reviews, users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { CheckCircle, Download, FileText } from 'lucide-react';
import Link from 'next/link';

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
        {reviewerReviews.length <= 0 ? (
          <p>No reviews given</p>
        ) : (
          reviewerReviews.map((r) => (
            <React.Fragment key={r.id}>
              <div className="mb-4">
                <div className="flex justify-between">
                  <p className="text-sm text-muted-foreground">
                    Reviewer&lsquo;s feedback
                  </p>
                  <div className="text-center text-green-900 bg-slate-100 px-2 py-1 rounded-md">
                    <span className="flex items-center">
                      <CheckCircle className="mr-4" size={18} />
                      {r.status}
                    </span>
                  </div>
                </div>
                <p className="mt-2">{r.message}</p>
              </div>

              <div className="my-5">
                <p className="text-sm text-muted-foreground mb-3">
                  Annotated file
                </p>
                {r.fileIds.map((f) => (
                  <div
                    key={f}
                    className="flex items-center justify-between p-2 border rounded-lg"
                  >
                    <div className="flex items-center space-x-4">
                      <FileText className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Reviewed file</p>
                        <p className="text-sm text-muted-foreground">12kb</p>
                      </div>
                    </div>
                    <Button variant="secondary" size="sm">
                      <Link href={f} download>
                        <span className="flex items-center">
                          <Download className="mr-2 text-gray-600" /> Download
                        </span>
                      </Link>
                    </Button>
                  </div>
                ))}
              </div>

              <div className="mt-4">
                <p className="text-sm text-muted-foreground">Reviewer</p>
                <p className="mt-2">
                  <User id={r.userId} />
                </p>
              </div>
            </React.Fragment>
          ))
        )}
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
  return (
    <span>
      {user[0].firstName} {user[0].lastName}
    </span>
  );
};
