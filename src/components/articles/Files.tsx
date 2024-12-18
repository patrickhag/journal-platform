import { db, files } from '@/db/schema';
import { Button } from '../ui/button';
import { eq } from 'drizzle-orm';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { FileText } from 'lucide-react';
import ReviewModal from "./Review"
import withPermissions from "../WithPermission"
import { USER_ROLES } from '@/lib/roles'

async function Files({ articleId, role }: { articleId: string, role: typeof USER_ROLES[number] }) {
  const filesData = await db
    .select()
    .from(files)
    .where(eq(files.articleId, articleId));
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
              <div className="flex items-center space-x-4">
                <FileText className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">{file.originalName}</p>
                  <p className="text-sm text-muted-foreground">
                    {file.publicId.split('.').at(-1)} | 12kb
                  </p>
                </div>
              </div>
              <Button variant="secondary" size="sm">
                <Link href={file.publicId} download>
                  Download
                </Link>
              </Button>
              <UlterFile requiredPermissions={['MANAGE_REVIEWERS']} role={role} fallback={<></>} />
            </div>
          ))}
        </CardContent>
      </Card>
    </>
  );
}

export default Files;

const FileControls = () => <div className="space-x-1 flex">
  <ReviewModal />
  <Button variant="link" className="text-blue-500 hover:text-blue-600">
    Update
  </Button>
  <Button variant="link" className="text-red-500 hover:text-red-600">
    Delete
  </Button>
</div>

const UlterFile = withPermissions(FileControls)
