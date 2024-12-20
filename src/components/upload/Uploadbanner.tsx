'use client';
import { filesSchema } from '@/schemas/reviewer';
import { useRouter, useSearchParams } from 'next/navigation';
import { type FC } from 'react';
import { safeParse, serialize } from 'zod-urlsearchparams';
import { UploadDropzone } from '@uploadthing/react';
import { OurFileRouter } from '@/app/api/uploadthing/core';

export const Uploadbanner: FC<{ fileFormats: string[] }> = ({}) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const filesValidation = safeParse({
    schema: filesSchema,
    input: new URLSearchParams(searchParams.toString()),
  });
  const files = filesValidation.data?.files || [];

  return (
    <UploadDropzone<OurFileRouter, 'imageUploader'>
      endpoint="imageUploader"
      onClientUploadComplete={(res) => {
        res.forEach((file) => {
          files.push({
            originalName: file.name,
            publicId: file.url,
            resourceType: file.type,
            bytes: file.size.toString(),
          });
        });

        const serializedData = serialize({
          data: { files },
          schema: filesSchema,
        });

        const params = new URLSearchParams(searchParams.toString());
        params.delete('files');
        router.push(`?${params.toString()}&${serializedData.toString()}`);
      }}
      onUploadError={(error: Error) => {
        alert(`ERROR! ${error.message}`);
      }}
    />
  );
};
