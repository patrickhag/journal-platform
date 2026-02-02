'use client';

import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { CloudUpload } from 'lucide-react';
import { FileInput, FileUploader } from '@/components/ui/file-upload';
import { useUploadArticleFiles, useUploadFiles } from '@/hooks/useUploadFiles';
import Loader from '../Loader';
import { PutBlobResult } from '@vercel/blob';
import type { DropzoneOptions } from 'react-dropzone';

type DragAndDropFileInputProps = {
  onUploadComplete?: (blob: PutBlobResult[]) => void;
  dropzoneOptions?: DropzoneOptions;
};

export function DragAndDropFileInput({
  onUploadComplete,
  dropzoneOptions,
}: DragAndDropFileInputProps) {
  const [files, setFiles] = useState<File[] | null>(null);

  const dropZoneConfig = useMemo(
    () => ({
      maxFiles: 5,
      maxSize: 1024 * 1024 * 4,
      multiple: true,
      ...dropzoneOptions,
    }),
    [dropzoneOptions]
  );

  const form = useForm();

  const { mutate, isPending } = onUploadComplete
    ? useUploadFiles({
        onSuccess: (blob) => {
          setFiles(null);
          onUploadComplete?.(blob);
        },
      })
    : useUploadArticleFiles(setFiles);

  function onSubmit() {
    mutate(files!);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit as any)} className="space-y-8">
        <FormField
          control={form.control}
          name="files"
          render={() => (
            <FormItem>
              <FormControl>
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
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {files && (
          <div className="flex items-center justify-center">
            <Button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white"
              disabled={isPending}
            >
              {isPending ? (
                <Loader text="Uploading..." />
              ) : files ? (
                `Upload ${files.length} file(s)`
              ) : (
                'Upload'
              )}
            </Button>
          </div>
        )}
      </form>
    </Form>
  );
}
