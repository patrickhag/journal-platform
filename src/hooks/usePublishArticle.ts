import {
  MessageResponse,
  TIssues,
  TPublication,
  TPublishedArticle,
} from '@/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
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

export const useGetIssues = () => {
  const fetchArticles = async (): Promise<TIssues[]> => {
    const response = await axios.get<TIssues[]>(`/api/articles/publish`);

    if (response.status !== 200) {
      throw new Error('Error occurred while fetching articles');
    }

    return response.data;
  };
  return useQuery<TIssues[], Error>({
    queryKey: ['publishedIssues'],
    queryFn: fetchArticles,
    refetchOnWindowFocus: false,
  });
};

export const useGetPublishedArticles = (
  status: 'AWAITING DECISION' | 'PUBLISHED' | 'WITHDRAWN'
) => {
  const fetchArticles = async (): Promise<TPublishedArticle[]> => {
    const url = `/api/articles/published?status=${status}`;
    const response = await axios.get<TPublishedArticle[]>(url);

    if (response.status !== 200) {
      throw new Error('Error occurred while fetching articles');
    }

    return response.data;
  };
  return useQuery<TPublishedArticle[], Error>({
    queryKey: ['publishedArticles', status],
    queryFn: fetchArticles,
  });
};

export const useGetPublishedArticle = (slug: string) => {
  return useQuery<TPublication, Error>({
    queryKey: ['publishedArticle', slug],
    queryFn: async () => {
      const { data } = await axios.get<TPublication>(
        `/api/articles/published/${slug}`
      );
      return data;
    },
    refetchOnWindowFocus: false,
  });
};
