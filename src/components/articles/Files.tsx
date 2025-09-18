import { files } from '@/db/schema';
import { db } from '@/db/db';
import { Button } from '../ui/button';
import { eq } from 'drizzle-orm';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Download, File } from 'lucide-react';
import AddArticleFiles from './AddArticleFiles';

async function Files({
  articleId,
  userId,
  articleStatus,
}: {
  userId?: string;
  articleId: string;
  role: string;
  articleStatus: string;
}) {
  const filesData = await db
    .select()
    .from(files)
    .where(eq(files.articleId, articleId));

  return (
    <>
      <Card>
        <div className="flex justify-between items-center">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-[#1a237e]">
              Article Files
            </CardTitle>
          </CardHeader>
          {userId === filesData[0].userId && articleStatus !== 'PUBLISHED' && (
            <AddArticleFiles articleId={articleId} userId={userId} />
          )}
        </div>
        <CardContent className="space-y-4">
          {filesData.map((file) => (
            <div
              key={file.id}
              className="flex items-center justify-between p-2 border rounded-lg"
            >
              <div className="flex items-center">
                <File className="h-5 w-5 text-muted-foreground mr-2 text-blue-500" />
                <div>
                  <p className="font-medium line-clamp-1">
                    {file.originalName}
                  </p>
                  <p className="text-sm text-muted-foreground my-1">
                    {file.fileType || 'Revised Manuscript'}
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
                    <Download className="mr-2 text-gray-600" /> Download
                  </span>
                </Link>
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>
    </>
  );
}

export default Files;
