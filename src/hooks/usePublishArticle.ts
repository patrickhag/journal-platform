import { MessageResponse } from '@/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { Dispatch, SetStateAction } from 'react';
import { toast } from 'sonner';

export const usePublishArticle = (
  onOpenChange: Dispatch<SetStateAction<boolean>>,
  clearUrl: () => void
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      articleId,
      data,
    }: {
      articleId: string;
      data: string[];
    }) => {
      const response = await axios.patch<MessageResponse>(
        `/api/articles/article/${articleId}`,
        {
          publishedFile: data,
        }
      );
      return response.data;
    },
    onSuccess: ({ message }) => {
      queryClient.invalidateQueries({ queryKey: ['proofs'] });
      onOpenChange(false);
      toast.success(message);
      clearUrl();
    },
    onError: (error: Error | AxiosError) => {
      const message = axios.isAxiosError(error)
        ? error.response?.data.message
        : error.message;

      toast.error(message || 'Failed to publish an article');
    },
  });
};
