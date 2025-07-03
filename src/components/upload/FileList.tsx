'use client';

import { filesSchema } from '@/schemas/reviewer';
import { FileText, Pencil, Trash2 } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { safeParse, serialize } from 'zod-urlsearchparams';
import { Button } from '../ui/button';
import FileTypesModal from './FileTypeModel';

export const FileList = ({ isEditNeeded }: { isEditNeeded?: boolean }) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const filesValidation = safeParse({
    schema: filesSchema,
    input: new URLSearchParams(searchParams.toString()),
  });

  const files = filesValidation.data?.files || [];

  return (
    <>
      {files.map((file) => (
        <div
          key={file.publicId}
          className="flex items-center justify-between rounded-lg border p-4 mt-3"
        >
          <div className="flex items-center space-x-4">
            <FileText />
            <div>
              <p className="font-medium text-sm">
                {file.originalName.slice(0, file.originalName.lastIndexOf('.'))}
              </p>
              <p className="text-sm text-gray-500">
                {file.originalName.slice(file.originalName.lastIndexOf('.'))}
              </p>
            </div>
          </div>
          <div className="grid gap-2">
            <div className="flex space-x-3 justify-end">
              {!isEditNeeded && (
                <FileTypesModal
                  originalName={file.originalName}
                  publicId={file.publicId}
                  resourceType={file.resourceType}
                >
                  <Button variant="outline" size="icon">
                    <Pencil className="h-4 w-4" />
                    <span className="sr-only">Edit</span>
                  </Button>
                </FileTypesModal>
              )}
              <form
                action={() => {
                  const serializedData = serialize({
                    data: {
                      files: files.filter((f) => f.publicId !== file.publicId),
                    },
                    schema: filesSchema,
                  });

                  const params = new URLSearchParams(searchParams.toString());
                  params.delete('files');
                  router.replace(
                    `?${params.toString()}&${serializedData.toString()}`
                  );
                }}
              >
                <input type="hidden" name="publicId" value={file.publicId} />
                <Button variant="outline" size="icon" type="submit">
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">Delete</span>
                </Button>
              </form>
            </div>
            {file.fileType && (
              <small className="bg-gray-300 py-1 px-2 rounded-sm">
                {file.fileType}
              </small>
            )}
          </div>
        </div>
      ))}
    </>
  );
};
