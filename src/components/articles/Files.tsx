import { files, reviewers } from '@/db/schema';
import { db } from '@/db/db';
import { Button } from '../ui/button';
import { and, eq } from 'drizzle-orm';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Download, FileText } from 'lucide-react';
import ReviewModal from './Review';
import { USER_ROLES } from '@/lib/roles';
import withPermissions from '../WithPermission';

async function Files({
  articleId,
  role,
}: {
  articleId: string;
  role: (typeof USER_ROLES)[number];
}) {
  const filesData = await db
    .select()
    .from(files)
    .where(eq(files.articleId, articleId));

  const hasReviewerAcceptInvitation = await db.query.reviewers.findFirst({
    where: and(
      eq(reviewers.articleId, articleId),
      eq(reviewers.acceptedInvitation, true)
    ),
  });

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Article Files</CardTitle>
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
              <Button variant="outline" size="sm">
                <Link href={file.publicId} download>
                  <span className="flex items-center">
                    <Download className="mr-2 text-gray-600" /> Download
                  </span>
                </Link>
              </Button>

              {/* <div className="flex space-x-1"> */}
              {hasReviewerAcceptInvitation && (
                <UlterFile
                  requiredPermissions={['ADD_REVIEW']}
                  role={role}
                  fallback={<></>}
                />
              )}
              {/* <Button
                  variant="link"
                  className="text-blue-500 hover:text-blue-600"
                >
                  Update
                </Button>
                <Button
                  variant="link"
                  className="text-red-500 hover:text-red-600"
                >
                  Delete
                </Button> */}
              {/* </div> */}
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
