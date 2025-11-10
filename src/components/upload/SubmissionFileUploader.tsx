'use client';

import { type ReactNode, useEffect, useMemo, useState } from 'react';
import { CloudUpload, FileText, X } from 'lucide-react';
import type { DropzoneOptions } from 'react-dropzone';

import { FileInput, FileUploader } from '@/components/ui/file-upload';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const FILE_TYPE_CONFIG = {
  PDF: {
    label: 'PDF',
    mime: 'application/pdf',
    extensions: ['.pdf'],
  },
  DOC: {
    label: 'DOC',
    mime: 'application/msword',
    extensions: ['.doc'],
  },
  DOCX: {
    label: 'DOCX',
    mime: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    extensions: ['.docx'],
  },
  PNG: {
    label: 'PNG',
    mime: 'image/png',
    extensions: ['.png'],
  },
  JPG: {
    label: 'JPG',
    mime: 'image/jpeg',
    extensions: ['.jpg', '.jpeg'],
  },
  JPEG: {
    label: 'JPEG',
    mime: 'image/jpeg',
    extensions: ['.jpeg'],
  },
} as const;

type AllowedFileType = keyof typeof FILE_TYPE_CONFIG;

const DEFAULT_ALLOWED_TYPES: AllowedFileType[] = ['PDF', 'DOC', 'DOCX'];

type SubmissionFileUploaderProps = {
  value?: File[];
  onChange?: (files: File[]) => void;
  allowedFileTypes?: AllowedFileType[];
  maxFiles?: number;
  maxSizeMb?: number;
  multiple?: boolean;
  className?: string;
  icon?: ReactNode;
};

const bytesFromMb = (mb?: number) => (mb ? mb * 1024 * 1024 : undefined);

export const SubmissionFileUploader = ({
  value,
  onChange,
  allowedFileTypes,
  maxFiles = 10,
  maxSizeMb = 10,
  multiple = true,
  className,
  icon,
}: SubmissionFileUploaderProps) => {
  const [internalFiles, setInternalFiles] = useState<File[]>(value ?? []);

  useEffect(() => {
    if (!value) {
      setInternalFiles([]);
      return;
    }
    setInternalFiles(value);
  }, [value]);

  const resolvedAllowedTypes = useMemo<AllowedFileType[]>(() => {
    const provided = allowedFileTypes?.filter(
      (type): type is AllowedFileType => type in FILE_TYPE_CONFIG
    );
    return (
      provided && provided.length > 0 ? provided : DEFAULT_ALLOWED_TYPES
    ) as AllowedFileType[];
  }, [allowedFileTypes]);

  const accept = useMemo<Exclude<DropzoneOptions['accept'], undefined>>(() => {
    return resolvedAllowedTypes.reduce<Record<string, string[]>>(
      (acc, type) => {
        const config = FILE_TYPE_CONFIG[type];
        acc[config.mime] = [...config.extensions];
        return acc;
      },
      {}
    );
  }, [resolvedAllowedTypes]);

  const dropzoneOptions = useMemo<DropzoneOptions>(
    () => ({
      accept,
      maxFiles,
      maxSize: bytesFromMb(maxSizeMb),
      multiple,
    }),
    [accept, maxFiles, maxSizeMb, multiple]
  );

  const handleValueChange = (files: File[] | null) => {
    const nextFiles = files ?? [];
    setInternalFiles(nextFiles);
    onChange?.(nextFiles);
  };

  const removeFile = (index: number) => {
    const nextFiles = internalFiles.filter((_, idx) => idx !== index);
    setInternalFiles(nextFiles);
    onChange?.(nextFiles);
  };

  const allowedText = useMemo(() => {
    if (!resolvedAllowedTypes.length) return null;
    return `Allowed: ${resolvedAllowedTypes.join(', ')}`;
  }, [resolvedAllowedTypes]);

  return (
    <div className={cn('space-y-6', className)}>
      <FileUploader
        value={internalFiles}
        onValueChange={handleValueChange}
        dropzoneOptions={dropzoneOptions}
        className="rounded-lg border border-dashed border-border bg-background"
      >
        <FileInput className="flex flex-col items-center justify-center gap-3 py-12 text-center">
          {icon ?? <CloudUpload className="h-12 w-12 text-muted-foreground" />}
          <div className="space-y-1">
            <p className="text-base font-semibold">
              Click to upload or drag and drop
            </p>
            {allowedText && (
              <p className="text-xs text-muted-foreground">{allowedText}</p>
            )}
          </div>
        </FileInput>
      </FileUploader>

      {internalFiles.length > 0 && (
        <div className="space-y-3">
          <p className="text-sm font-medium">Uploaded Files:</p>
          <div className="space-y-2">
            {internalFiles.map((file, index) => {
              const sizeMb = (file.size / (1024 * 1024)).toFixed(2);
              return (
                <div
                  key={`${file.name}-${index}`}
                  className="flex items-center justify-between rounded-lg border border-border bg-card px-4 py-3"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="h-6 w-6 text-blue-500" />
                    <div className="text-sm">
                      <p className="font-medium text-foreground">{file.name}</p>
                      <p className="text-muted-foreground text-xs">
                        {sizeMb} MB
                      </p>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="text-destructive hover:text-destructive"
                    onClick={() => removeFile(index)}
                  >
                    <X className="h-4 w-4" />
                    <span className="sr-only">Remove {file.name}</span>
                  </Button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
