import { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { FileInput, FileUploader } from '@/components/ui/file-upload';
import { CloudUpload } from 'lucide-react';
import { useUploadReviewerFiles } from '@/hooks/useUploadFiles';
import { Button } from '@/components/ui/button';

export default function UploadReviewFiles() {
  const [files, setFiles] = useState<File[] | null>(null);

  const dropZoneConfig = {
    maxFiles: 5,
    maxSize: 1024 * 1024 * 4,
    multiple: true,
  };

  const form = useForm();

  const { mutate, isPending } = useUploadReviewerFiles();

  console.log('files>>>', files);

  function onSubmit() {
    mutate(files!);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit as any)}
        className="space-y-8 max-w-3xl mx-auto py-5"
      >
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
              {isPending
                ? 'Uploading...'
                : files
                  ? `Upload ${files.length} file(s)`
                  : 'Upload'}
            </Button>
          </div>
        )}
      </form>
    </Form>
  );
}
