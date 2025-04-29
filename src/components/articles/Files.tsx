import { articleSubmissions, files, reviewAssignments } from '@/db/schema';
import { db } from '@/db/db';
import { Button } from '../ui/button';
import { and, eq } from 'drizzle-orm';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { FileText, EyeIcon } from 'lucide-react';
import ReviewModal from './Review';
import { USER_ROLES } from '@/lib/roles';
import withPermissions from '../WithPermission';

async function Files({
  articleId,
  role,
  userId,
}: {
  userId: string;
  articleId: string;
  role: (typeof USER_ROLES)[number];
}) {
  const filesData = await db
    .select()
    .from(files)
    .where(eq(files.articleId, articleId));

  const hasReviewerAcceptInvitation =
    await db.query.reviewAssignments.findFirst({
      where: and(
        eq(reviewAssignments.status, 'Accepted'),
        eq(reviewAssignments.articleId, articleId),
        eq(reviewAssignments.userId, userId)
      ),
    });

  const isArticlePublished = await db.query.articleSubmissions.findFirst({
    columns: {
      articleStatus: true,
    },
    where: eq(articleSubmissions.id, articleId),
  });

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-[#1a237e]">
            Article Files
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {filesData.map((file) => (
            <div
              key={file.id}
              className="flex items-center justify-between p-2 border rounded-lg"
            >
              <div className="flex items-center">
                <FileText className="h-5 w-5 text-muted-foreground mr-2" />
                <div>
                  <p className="font-medium">{file.originalName}</p>
                  <p className="text-sm text-muted-foreground my-1">
                    {file.fileType}
                  </p>
                </div>
              </div>
              <Button variant="secondary" size="sm">
                <Link
                  href={file.publicId}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="flex items-center">
                    <EyeIcon className="mr-2 text-gray-600" /> View
                  </span>
                </Link>
              </Button>
              {hasReviewerAcceptInvitation?.status === 'Accepted' && (
                <div className="flex space-x-1">
                  <UlterFile
                    requiredPermissions={['ADD_REVIEW']}
                    role={role}
                    fallback={<></>}
                  />
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>
    </>
  );
}

export default Files;

const FileControls = () => <ReviewModal />;

const UlterFile = withPermissions(FileControls);
