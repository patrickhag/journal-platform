'use client';

import { FileText, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

type FileListProps = {
  files: File[];
  removeFile: (index: number) => void;
};

export const CustomFileList = ({ files, removeFile }: FileListProps) => {
  return (
    <>
      {files.map((file, index) => (
        <div
          key={index}
          className="flex items-center justify-between rounded-lg border p-4"
        >
          <div className="flex items-center space-x-4">
            <FileText />
            <div>
              <p className="font-medium text-sm">
                {file.name.slice(0, file.name.lastIndexOf('.'))}
              </p>
              <p className="text-sm text-gray-500">
                {file.name.slice(file.name.lastIndexOf('.'))}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              size="icon"
              type="button"
              onClick={() => removeFile(index)}
            >
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">Delete</span>
            </Button>
          </div>
        </div>
      ))}
    </>
  );
};
