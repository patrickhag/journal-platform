'use client';

import { useState } from 'react';
import { Eye, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import FileViewerModal from '@/components/FileViewerModal';
import AddArticleFiles from './AddArticleFiles';

type ArticleFile = {
  id: string;
  userId: string;
  publicId: string;
  resourceType: string | null;
  originalName: string | null;
  fileType: string | null;
  articleId: string | null;
};

export default function FilesClient({
  filesData,
  userId,
  articleStatus,
  articleId,
}: {
  filesData: ArticleFile[];
  userId?: string;
  articleStatus: string;
  articleId: string;
}) {
  const [viewerOpen, setViewerOpen] = useState(false);
  const [activeFile, setActiveFile] = useState<ArticleFile | null>(null);

  const handleOpen = (file: ArticleFile) => {
    setActiveFile(file);
    setViewerOpen(true);
  };

  const handleOpenChange = (open: boolean) => {
    setViewerOpen(open);
    if (!open) {
      setActiveFile(null);
    }
  };

  const canEdit =
    Boolean(userId) &&
    filesData[0]?.userId === userId &&
    articleStatus !== 'PUBLISHED';

  console.log('filesData:', filesData);

  return (
    <Card>
      <div className="flex justify-between items-center">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-[#1a237e]">
            Article Files
          </CardTitle>
        </CardHeader>
        {canEdit && userId && (
          <AddArticleFiles articleId={articleId} userId={userId} />
        )}
      </div>
      <CardContent className="space-y-4">
        {filesData.map((file) => (
          <div
            key={file.id}
            className="flex items-center justify-between p-3 border rounded-lg"
          >
            <div className="flex items-center">
              <FileText className="h-5 w-5 mr-2 text-blue-500" />
              <div>
                <p className="font-medium line-clamp-1">{file.originalName}</p>
                <p className="text-sm text-muted-foreground my-1">
                  {file.fileType || 'Revised Manuscript'}
                </p>
              </div>
            </div>
            <div className="flex justify-between gap-3">
              <Button
                variant="secondary"
                size="sm"
                type="button"
                onClick={() => handleOpen(file)}
              >
                <span className="flex items-center">
                  <Eye className="mr-2 text-gray-600" /> View
                </span>
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
      <FileViewerModal
        open={viewerOpen}
        onOpenChange={handleOpenChange}
        documents={
          activeFile
            ? [
                {
                  uri: activeFile.publicId,
                  fileName: activeFile.originalName,
                },
              ]
            : []
        }
        title={activeFile?.originalName || 'Document Viewer'}
      />
    </Card>
  );
}
