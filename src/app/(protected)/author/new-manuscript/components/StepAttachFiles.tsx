'use client';

import { Controller, useFormContext } from 'react-hook-form';
import { useEffect, useRef } from 'react';
import { FileText, X, Pencil } from 'lucide-react';
import { toast } from 'sonner';

import { SubmissionFileUploader } from '@/components/upload/SubmissionFileUploader';
import { FileTypeModal } from './FileTypeModal';
import { Button } from '@/components/ui/button';

import type { ManuscriptFormValues } from '../schema';

export const StepAttachFiles = () => {
  const {
    control,
    watch,
    formState: { errors },
  } = useFormContext<ManuscriptFormValues>();

  const files = watch('files') || [];
  const previousFilesLengthRef = useRef(files.length);
  const filesError = errors.files?.message;

  // Show toast when a new file is uploaded
  useEffect(() => {
    if (files.length > previousFilesLengthRef.current) {
      toast.info('Please specify the type of file you just uploaded.');
    }
    previousFilesLengthRef.current = files.length;
  }, [files.length]);

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold">Upload files</h1>
        <p className="text-sm">
          Please select type for each file{' '}
          <span className="text-red-500">*</span>
        </p>
      </div>

      <Controller
        name="files"
        control={control}
        render={({ field }) => {
          const currentFiles = field.value || [];

          const handleFileUpload = (uploadedFiles: File[]) => {
            // Convert File[] to { file: File, fileType?: string }[]
            const newFiles = uploadedFiles
              .filter(
                (newFile) =>
                  !currentFiles.some(
                    (existing) => existing.file.name === newFile.name
                  )
              )
              .map((file) => ({ file, fileType: undefined }));

            const updatedFiles = [...currentFiles, ...newFiles];

            field.onChange(updatedFiles);
          };

          const handleRemoveFile = (index: number) => {
            const updatedFiles = currentFiles.filter((_, idx) => idx !== index);
            field.onChange(updatedFiles);
          };

          const handleFileTypeChange = (index: number, fileType: string) => {
            const updatedFiles = currentFiles.map((item, idx) =>
              idx === index ? { ...item, fileType } : item
            );
            field.onChange(updatedFiles);
          };

          const fileList = currentFiles.map((item) => item.file);

          return (
            <div className="space-y-6">
              <SubmissionFileUploader
                value={fileList}
                onChange={handleFileUpload}
                allowedFileTypes={['DOC', 'DOCX']}
                maxFiles={10}
                maxSizeMb={10}
                multiple
                hideFileList
              />

              {currentFiles.length > 0 && (
                <div className="space-y-3">
                  <p className="text-sm font-medium">Uploaded Files:</p>
                  <div className="space-y-2">
                    {currentFiles.map((fileItem, index) => {
                      const file = fileItem.file;
                      const sizeMb = (file.size / (1024 * 1024)).toFixed(2);
                      const fileError = (errors.files as any)?.[index]
                        ?.fileType;
                      const hasError = !fileItem.fileType || fileError;
                      return (
                        <div
                          key={`${file.name}-${index}`}
                          className={`flex items-center justify-between rounded-lg border px-4 py-3 ${
                            hasError
                              ? 'border-destructive bg-destructive/5'
                              : 'border-border bg-card'
                          }`}
                        >
                          <div className="flex items-center gap-3 flex-1">
                            <FileText className="h-6 w-6 text-blue-500" />
                            <div className="text-sm flex-1">
                              <p className="font-medium text-foreground">
                                {file.name}
                              </p>
                              <div className="flex items-center gap-2">
                                <p className="text-muted-foreground text-xs">
                                  {sizeMb} MB
                                </p>
                                {fileItem.fileType && (
                                  <span className="bg-gray-300 py-1 px-2 rounded-sm text-xs">
                                    {fileItem.fileType}
                                  </span>
                                )}
                                {hasError && (
                                  <span className="text-xs text-destructive">
                                    File type required
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <FileTypeModal
                              currentFileType={fileItem.fileType}
                              onSave={(fileType) =>
                                handleFileTypeChange(index, fileType)
                              }
                            >
                              <Button
                                type="button"
                                variant="outline"
                                size="icon"
                              >
                                <Pencil className="h-4 w-4" />
                                <span className="sr-only">Edit file type</span>
                              </Button>
                            </FileTypeModal>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="text-destructive hover:text-destructive"
                              onClick={() => handleRemoveFile(index)}
                            >
                              <X className="h-4 w-4" />
                              <span className="sr-only">
                                Remove {file.name}
                              </span>
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        }}
      />

      {filesError && <p className="text-sm text-destructive">{filesError}</p>}
    </div>
  );
};
