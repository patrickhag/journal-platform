'use client';

import { Dispatch, SetStateAction } from 'react';
import { CloudUpload } from 'lucide-react';
import { FileInput, FileUploader } from '@/components/ui/file-upload';

interface CustomUploadFileProps {
  files: File[] | null;
  setFiles: Dispatch<SetStateAction<File[] | null>>;
}

export function CustomUploadFile({ files, setFiles }: CustomUploadFileProps) {
  const dropZoneConfig = {
    maxFiles: 5,
    maxSize: 1024 * 1024 * 4,
    multiple: true,
  };

  return (
    <FileUploader
      value={files}
      onValueChange={setFiles}
      dropzoneOptions={dropZoneConfig}
      className="relative bg-background rounded-lg p-2"
    >
      <FileInput
        id="fileInput"
        className="outline-dashed outline-1 outline-slate-500"
      >
        <div className="flex items-center justify-center flex-col p-8 w-full ">
          <CloudUpload className="text-gray-500 w-10 h-10" />
          <p className="mb-1 text-sm text-gray-500 dark:text-gray-400">
            <span className="font-semibold">Click to upload</span>
            &nbsp; or drag and drop
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Images, PDFs, files and texts.
          </p>
        </div>
      </FileInput>
    </FileUploader>
  );
}
