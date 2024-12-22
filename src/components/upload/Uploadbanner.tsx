'use client';
import { filesSchema } from '@/schemas/reviewer';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { type FC } from 'react';
import { safeParse, serialize } from 'zod-urlsearchparams';
import { UploadDropzone } from '@uploadthing/react';
import { OurFileRouter } from '@/app/api/uploadthing/core';
import { useSession } from 'next-auth/react';

export const Uploadbanner: FC<{ fileFormats: string[] }> = ({ }) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const filesValidation = safeParse({
    schema: filesSchema,
    input: new URLSearchParams(searchParams.toString()),
  });
  const files = filesValidation.data?.files || [];

  const param = useParams()
  const session = useSession()
  if (!session.data?.user?.id) return undefined

  return (
    <UploadDropzone<OurFileRouter, 'imageUploader'>
      endpoint="imageUploader"
      onClientUploadComplete={(res) => {
        res.forEach((file) => {
          files.push({
            originalName: file.name,
            publicId: file.url,
            resourceType: file.type,
            articleId: (param as { articleId: string }).articleId,
            uploadedBy: session.data.user?.id as string,
            id: ''
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
