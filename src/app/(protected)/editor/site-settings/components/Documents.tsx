'use client';

import { useState, useEffect, useRef } from 'react';
import { TabsContent } from '@/components/ui/tabs';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useCreateManuals, useGetManuals } from '@/hooks/useSettings';
import Loader from '@/components/Loader';
import { DragAndDropFileInput } from '@/components/upload/FileInput';
import { FileList } from '@/components/upload/FileList';
import { filesSchema } from '@/schemas/reviewer';
import { useSearchParams } from 'next/navigation';
import { safeParse } from 'zod-urlsearchparams';
import { useClearURL } from '@/components/ClearURL';
import { FileText, Eye } from 'lucide-react';
import FileViewerModal from '@/components/FileViewerModal';

export default function Documents() {
  const [paperTemplateFileId, setPaperTemplateFileId] = useState<string>('');
  const [copyrightTemplateFileId, setCopyrightTemplateFileId] =
    useState<string>('');
  const [humanPartsConsentFileId, setHumanPartsConsentFileId] =
    useState<string>('');
  const [activeUploadSection, setActiveUploadSection] = useState<
    'paper' | 'copyright' | 'humanPartsConsent' | null
  >(null);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewerDoc, setViewerDoc] = useState<{
    uri: string;
    fileName?: string;
  } | null>(null);
  const previousFilesCountRef = useRef<number>(0);
  const processedFileIdsRef = useRef<Set<string>>(new Set());

  const searchParams = useSearchParams();
  const clearUrl = useClearURL();

  const { data: manualData, isPending: isGettingManualsPending } =
    useGetManuals();
  const { mutate: createManualMutation, isPending } = useCreateManuals();

  // Initialize file IDs from existing manual data
  useEffect(() => {
    if (manualData) {
      if (manualData.paperTemplate) {
        setPaperTemplateFileId(manualData.paperTemplate);
      }
      if (manualData.copyrightTemplate) {
        setCopyrightTemplateFileId(manualData.copyrightTemplate);
      }
      if (manualData.humanPartsConsent) {
        setHumanPartsConsentFileId(manualData.humanPartsConsent);
      }
    }
  }, [manualData]);

  // Watch for file uploads in URL params and assign to appropriate section
  useEffect(() => {
    const filesValidation = safeParse({
      schema: filesSchema,
      input: new URLSearchParams(searchParams.toString()),
    });

    const files = filesValidation.data?.files || [];
    const currentFilesCount = files.length;

    // Check if new files were added (count increased) and haven't been processed yet
    if (currentFilesCount > previousFilesCountRef.current && files.length > 0) {
      const newFileId = files[0].publicId; // Get the first file ID

      // Skip if we've already processed this file
      if (processedFileIdsRef.current.has(newFileId)) {
        previousFilesCountRef.current = currentFilesCount;
        return;
      }

      // Mark this file as processed
      processedFileIdsRef.current.add(newFileId);

      if (activeUploadSection === 'paper' && newFileId) {
        setPaperTemplateFileId(newFileId);
        // Keep activeUploadSection set so FileList continues to show
        // It will be cleared on save or when files are removed
      } else if (activeUploadSection === 'copyright' && newFileId) {
        setCopyrightTemplateFileId(newFileId);
        // Keep activeUploadSection set so FileList continues to show
        // It will be cleared on save or when files are removed
      } else if (activeUploadSection === 'humanPartsConsent' && newFileId) {
        setHumanPartsConsentFileId(newFileId);
        // Keep activeUploadSection set so FileList continues to show
        // It will be cleared on save or when files are removed
      } else if (!activeUploadSection && newFileId) {
        // If no active section is set, assign to the first empty one
        if (!paperTemplateFileId) {
          setPaperTemplateFileId(newFileId);
        } else if (!copyrightTemplateFileId) {
          setCopyrightTemplateFileId(newFileId);
        } else if (!humanPartsConsentFileId) {
          setHumanPartsConsentFileId(newFileId);
        }
      }
    }

    previousFilesCountRef.current = currentFilesCount;
  }, [
    searchParams,
    activeUploadSection,
    paperTemplateFileId,
    copyrightTemplateFileId,
    humanPartsConsentFileId,
    clearUrl,
  ]);

  const handleSave = () => {
    if (
      !paperTemplateFileId &&
      !copyrightTemplateFileId &&
      !humanPartsConsentFileId
    ) {
      return;
    }

    createManualMutation(
      {
        paperTemplate: paperTemplateFileId || undefined,
        copyrightTemplate: copyrightTemplateFileId || undefined,
        humanPartsConsent: humanPartsConsentFileId || undefined,
      },
      {
        onSettled: () => {
          clearUrl();
          setActiveUploadSection(null);
        },
      }
    );
  };

  const handleViewFile = (uri: string) => {
    setViewerDoc({ uri });
    setViewerOpen(true);
  };

  const handleViewerOpenChange = (open: boolean) => {
    setViewerOpen(open);
    if (!open) {
      setViewerDoc(null);
    }
  };

  return (
    <TabsContent value="documents" className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Documents</CardTitle>
          <CardDescription>Update the journal&apos;s documents</CardDescription>
        </CardHeader>
        {isGettingManualsPending ? (
          <Loader text="Loading manuals..." />
        ) : (
          <CardContent>
            <div className="space-y-3 mb-4">
              <p className="text-md font-medium mb-4">Upload paper template</p>
              {paperTemplateFileId && (
                <div className="flex items-center justify-between p-3 border rounded-lg mb-3">
                  <div className="flex items-center">
                    <FileText className="h-5 w-5 mr-2 text-blue-500" />
                    <div>
                      <p className="text-sm font-medium line-clamp-1">
                        Paper Template File
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-between gap-3">
                    <Button
                      variant="secondary"
                      size="sm"
                      type="button"
                      onClick={() =>
                        handleViewFile(
                          paperTemplateFileId,
                        )
                      }
                    >
                      <span className="flex items-center">
                        <Eye className="mr-2 text-gray-600" /> View
                      </span>
                    </Button>
                  </div>
                </div>
              )}
              <div
                onClick={() => setActiveUploadSection('paper')}
                onFocus={() => setActiveUploadSection('paper')}
              >
                <DragAndDropFileInput />
              </div>
              {activeUploadSection === 'paper' && <FileList isEditNeeded />}
            </div>
            <div className="space-y-3 mb-4">
              <p className="text-md font-medium mb-4">
                Upload copyright template
              </p>
              {copyrightTemplateFileId && (
                <div className="flex items-center justify-between p-3 border rounded-lg mb-3">
                  <div className="flex items-center">
                    <FileText className="h-5 w-5 mr-2 text-blue-500" />
                    <div>
                      <p className="text-sm font-medium line-clamp-1">
                        Copyright Template File
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-between gap-3">
                    <Button
                      variant="secondary"
                      size="sm"
                      type="button"
                      onClick={() =>
                        handleViewFile(
                          copyrightTemplateFileId,
                        )
                      }
                    >
                      <span className="flex items-center">
                        <Eye className="mr-2 text-gray-600" /> View
                      </span>
                    </Button>
                  </div>
                </div>
              )}
              <div
                onClick={() => setActiveUploadSection('copyright')}
                onFocus={() => setActiveUploadSection('copyright')}
              >
                <DragAndDropFileInput />
              </div>
              {activeUploadSection === 'copyright' && <FileList isEditNeeded />}
            </div>
            <div className="space-y-3 mb-4">
              <p className="text-md font-medium mb-4">
                Upload Human Parts Consent Form
              </p>

              {humanPartsConsentFileId && (
                <div className="flex items-center justify-between p-3 border rounded-lg mb-3">
                  <div className="flex items-center">
                    <FileText className="h-5 w-5 mr-2 text-blue-500" />
                    <div>
                      <p className="text-sm font-medium line-clamp-1">
                        Human Parts Consent Form
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-between gap-3">
                    <Button
                      variant="secondary"
                      size="sm"
                      type="button"
                      onClick={() =>
                        handleViewFile(
                          humanPartsConsentFileId,
                        )
                      }
                    >
                      <span className="flex items-center">
                        <Eye className="mr-2 text-gray-600" /> View
                      </span>
                    </Button>
                  </div>
                </div>
              )}
              <div
                onClick={() => setActiveUploadSection('humanPartsConsent')}
                onFocus={() => setActiveUploadSection('humanPartsConsent')}
              >
                <DragAndDropFileInput />
              </div>
              {activeUploadSection === 'humanPartsConsent' && (
                <FileList isEditNeeded />
              )}
            </div>
            <Button
              type="button"
              onClick={handleSave}
              className="w-full my-3"
              disabled={
                isPending || (!paperTemplateFileId && !copyrightTemplateFileId)
              }
            >
              {isPending ? <Loader text="Saving..." /> : 'Save Documents'}
            </Button>
          </CardContent>
        )}
      </Card>
      <FileViewerModal
        open={viewerOpen}
        onOpenChange={handleViewerOpenChange}
        documents={viewerDoc ? [viewerDoc] : []}
        title={viewerDoc?.fileName || 'Document'}
      />
    </TabsContent>
  );
}
