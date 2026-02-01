'use client';

import { useMutation } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { toast } from 'sonner';
import { PutBlobResult } from '@vercel/blob';
import { useRouter, useSearchParams } from 'next/navigation';
import { serialize, safeParse } from 'zod-urlsearchparams';
import { filesSchema } from '@/schemas/reviewer';
import { MessageResponse } from '@/types';

export const useUploadArticleFiles = (
  setFiles: (files: File[] | null) => void
) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const filesValidation = safeParse({
    schema: filesSchema,
    input: new URLSearchParams(searchParams.toString()),
  });
  const files = filesValidation.data?.files || [];

  return useMutation({
    mutationFn: async (files: File[]) => {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append('files', file);
      });

      const response = await axios.post<PutBlobResult[]>(
        '/api/files',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      return response.data;
    },
    onSuccess: (blob: PutBlobResult[]) => {
      files.push(
        ...blob.map((blob) => ({
          originalName: blob.pathname,
          publicId: blob.url,
          resourceType: blob.contentType,
        }))
      );
      setFiles(null);

      const serializedData = serialize({
        data: { files },
        schema: filesSchema,
      });

      const params = new URLSearchParams(searchParams.toString());
      params.delete('files');
      router.replace(`?${params.toString()}&${serializedData.toString()}`);
    },
    onError: (error: Error | AxiosError) => {
      const message = axios.isAxiosError(error)
        ? error.response?.data.message
        : error.message;

      toast.error(message || 'Failed to upload file');
    },
  });
};

export const useUploadReviewerFiles = () => {
  return useMutation({
    mutationFn: async (files: File[]) => {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append('files', file);
      });

      const response = await axios.post<PutBlobResult[]>(
        '/api/files',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      return response.data;
    },
    onSuccess: (/* blob: PutBlobResult[] */) => {
      return null;
    },
    onError: (error: Error | AxiosError) => {
      const message = axios.isAxiosError(error)
        ? error.response?.data.message
        : error.message;

      toast.error(message || 'Failed to upload file');
    },
  });
};
