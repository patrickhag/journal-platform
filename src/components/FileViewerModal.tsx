'use client';

import DocViewer, { DocViewerRenderers, PDFRenderer } from 'react-doc-viewer';
import { pdfjs } from 'react-pdf';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';

export type ViewerDocument = {
  uri: string;
  fileName: string | null;
};

pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

export default function FileViewerModal({
  open,
  onOpenChange,
  documents,
  title = 'Document Viewer',
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  documents: ViewerDocument[];
  title?: string;
}) {
  const hasDocs = documents.length > 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        aria-label={title}
        className="max-w-5xl w-[95vw] h-[85vh] p-0 bg-transparent border-none shadow-none [&>button]:hidden"
      >
        <DialogTitle className="sr-only">{title}</DialogTitle>
        <div className="h-full">
          {hasDocs ? (
            <DocViewer
              documents={documents}
              style={{
                height: '100%',
                borderRadius: '0.75rem',
                overflow: 'hidden',
              }}
              pluginRenderers={[PDFRenderer, ...DocViewerRenderers]}
              theme={{
                primary: '#5296d8',
                tertiary: '#5296d899',
                text_primary: '#ffffff',
                text_secondary: '#5296d8',
                text_tertiary: '#00000099',
                disableThemeScrollbar: false,
              }}
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
              No document selected.
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
