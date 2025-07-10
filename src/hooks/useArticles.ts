import { TArticle } from '@/schemas/reviewer';
import { IArticle, MessageResponse } from '@/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { toast } from 'sonner';

export const useGetUserArticles = (
  userId: string,
  debouncedSearchQuery: string,
  selectedStatus: string
) => {
  const fetchArticles = async () => {
    const response = await axios.get<TArticle[]>(`/api/articles/${userId}`, {
      params: {
        searchQuery: debouncedSearchQuery,
        articleStatus: selectedStatus,
      },
    });

    if (response.status !== 200) {
      throw new Error('Error occurred while fetching articles');
    }

    return response.data;
  };
  return useQuery<TArticle[], Error>({
    queryKey: ['manuscripts', userId, debouncedSearchQuery, selectedStatus],
    queryFn: fetchArticles,
    refetchOnWindowFocus: false,
    enabled: !!userId,
  });
};

export const useDeleteArticle = (
  setOpenDeleteArticleDialog: (openOrClose: boolean) => void
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (articleId: string) => {
      const response = await axios.delete<MessageResponse>(
        `/api/articles/article/${articleId}`
      );
      return response.data;
    },
    onSuccess: ({ message }) => {
      setOpenDeleteArticleDialog(false);
      queryClient.invalidateQueries({ queryKey: ['manuscripts'] });
      toast.success(message || 'Failed to delete article');
    },
    onError: (error: Error | AxiosError) => {
      const message = axios.isAxiosError(error)
        ? error.response?.data.message
        : error.message;

      toast.error(message || 'Failed to delete article');
    },
  });
};

export const useGetAcceptedArticles = () => {
  const fetchArticles = async (): Promise<IArticle[]> => {
    const response = await axios.get<IArticle[]>(`/api/articles`);

    if (response.status !== 200) {
      throw new Error('Error occurred while fetching articles');
    }

    return response.data;
  };
  return useQuery<IArticle[], Error>({
    queryKey: ['toBePublishedArticles'],
    queryFn: fetchArticles,
    refetchOnWindowFocus: false,
  });
};

type TPublishArticle = {
  pdfUrl: string;
  articleId: string;
  title: string;
  doi?: string;
  issueId: string;
  pageRange: string;
};

export const usePublishArticle = (clearUrl: () => void) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: TPublishArticle) => {
      const response = await axios.post<MessageResponse>(
        `/api/articles/publish`,
        data
      );
      return response.data;
    },
    onSuccess: ({ message }) => {
      queryClient.invalidateQueries({ queryKey: ['toBePublishedArticles'] });
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

type TPayloadData = {
  status: string;
  issueId: string;
  pageRange: string;
  doi?: string | undefined;
  pdfUrl?: string | undefined;
  publishedArticleId: string;
  articleId: string;
  title: string;
};

export const useUpdatePublishedArticle = (clearUrl: () => void) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: TPayloadData) => {
      const response = await axios.put<MessageResponse>(
        `/api/articles/published`,
        data
      );
      return response.data;
    },
    onSuccess: ({ message }) => {
      queryClient.invalidateQueries({ queryKey: ['publishedArticles'] });
      toast.success(message);
      clearUrl();
    },
    onError: (error: Error | AxiosError) => {
      const message = axios.isAxiosError(error)
        ? error.response?.data.message
        : error.message;

      toast.error(message || 'Failed to modify published article');
    },
  });
};
