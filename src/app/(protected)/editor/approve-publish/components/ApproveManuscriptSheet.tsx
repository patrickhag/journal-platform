'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useGetIssues } from '@/hooks/usePublishArticle';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { TPublishedArticle } from '@/types';
import { FileText } from 'lucide-react';
import { ApproveManuscriptDialog } from './ApproveManuscriptDialog';
import { useState } from 'react';

interface ApproveManuscriptSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  publishedArticle: TPublishedArticle | null;
}

export default function ApproveManuscriptSheet({
  open,
  onOpenChange,
  publishedArticle,
}: ApproveManuscriptSheetProps) {
  const { data: issues } = useGetIssues();
  const [showApproveDialog, setShowApproveDialog] = useState(false);

  const handleAcceptManuscript = () => {
    setShowApproveDialog(true);
  };

  const handleDialogClose = (open: boolean) => {
    setShowApproveDialog(open);
    if (!open) {
      onOpenChange(false);
    }
  };

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent
          side="right"
          className="w-full sm:max-w-2xl flex flex-col h-full"
        >
          <SheetHeader>
            <SheetTitle>Review Manuscript for Publication</SheetTitle>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto space-y-4 py-4 min-h-0">
            <div className="pt-4">
              <div className="pt-2">
                <p className="text-sm font-medium mb-2">Manuscript PDF File</p>
                <div className="w-full">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between rounded-lg border border-border bg-card px-4 py-3">
                      <div className="flex items-center gap-3">
                        <FileText className="h-6 w-6 text-blue-500" />
                        <div className="text-sm">
                          <a
                            href={publishedArticle?.pdfUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-medium text-blue-700 hover:underline break-all"
                          >
                            PDF file
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">
                  Status of the article
                </label>
                <Select value={publishedArticle?.status || ''} disabled>
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={publishedArticle?.status || ''}>
                      {publishedArticle?.status}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium">Issue</label>
                <Select value={publishedArticle?.issue.id || ''} disabled>
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Issue" />
                  </SelectTrigger>
                  <SelectContent>
                    {issues?.map((issue) => (
                      <SelectItem key={issue.id} value={issue.id}>
                        Issue {issue.issueNumber}, {issue.volume.year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label htmlFor="doi" className="text-sm font-medium">
                  DOI
                </label>
                <Input
                  id="doi"
                  value={publishedArticle?.doi || ''}
                  placeholder="10.1234/journal.2024.001"
                  disabled
                  className="mt-2"
                />
              </div>

              <div>
                <label htmlFor="pageRange" className="text-sm font-medium">
                  Page Range
                </label>
                <Input
                  id="pageRange"
                  value={publishedArticle?.pageRange || ''}
                  placeholder="1–15"
                  disabled
                  className="mt-2"
                />
              </div>
            </div>
          </div>

          <div className="border-t pt-4 sticky bottom-0 bg-background z-10">
            <Button
              onClick={handleAcceptManuscript}
              className="w-full bg-green-600 hover:bg-green-700 text-white"
              size="lg"
            >
              Accept This Manuscript
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      {publishedArticle && (
        <ApproveManuscriptDialog
          open={showApproveDialog}
          onOpenChange={handleDialogClose}
          articleId={publishedArticle.article.id}
        />
      )}
    </>
  );
}
