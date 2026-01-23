'use client';

import DocViewer, { DocViewerRenderers } from 'react-doc-viewer';
import { pdfjs } from 'react-pdf';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';

export type ViewerDocument = {
  uri: string;
};

// pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

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
        forceMount={true}
        className="max-w-5xl w-[95vw] h-[85vh] p-0 bg-transparent border-none shadow-none [&>button]:hidden"
      >
        <DialogTitle className="sr-only">{title}</DialogTitle>
        <DialogDescription className="sr-only">
          Dialog Modal for viewing {title}
        </DialogDescription>
        <div className="h-full overflow-auto">
          {hasDocs ? (
            <DocViewer
              documents={documents}
              style={{
                height: '100%',
                borderRadius: '0.75rem',
              }}
              pluginRenderers={[...DocViewerRenderers]}
              theme={{
                primary: '#5296d8',
                tertiary: '#5296d899',
                text_primary: '#ffffff',
                text_secondary: '#5296d8',
                text_tertiary: '#00000099',
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
