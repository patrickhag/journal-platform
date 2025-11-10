import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import type { ManuscriptFormValues } from '@/app/(protected)/author/new-manuscript/schema';

type SubmitManuscriptPayload = ManuscriptFormValues;

type SubmitResponse = {
  message?: string;
  articleId?: string;
};

const MANUSCRIPT_ENDPOINT = '/api/manuscripts';

export const useSubmitManuscript = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: async (payload: SubmitManuscriptPayload) => {
      const { files, ...rest } = payload;

      const formData = new FormData();
      formData.append('payload', JSON.stringify(rest));

      files.forEach((file) => {
        formData.append('files', file);
      });

      const response = await fetch(MANUSCRIPT_ENDPOINT, {
        method: 'POST',
        body: formData,
      });

      const result = (await response.json()) as SubmitResponse & {
        message?: string;
        error?: string;
      };

      if (!response.ok) {
        throw new Error(result.message ?? result.error ?? 'Submission failed.');
      }

      return result;
    },
    onSuccess: ({ message }) => {
      toast.success(message ?? 'Manuscript submitted successfully.');
      router.push('/author/submissions');
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : 'Failed to submit manuscript.'
      );
    },
  });
};
