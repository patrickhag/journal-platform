import { TManuscripts } from '@/schemas/reviewer';
import { IArticle, MessageResponse } from '@/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { toast } from 'sonner';

export const useGetUserArticles = (
  debouncedSearchQuery: string,
  selectedStatus: string
) => {
  const fetchArticles = async () => {
    const response = await axios.get<TManuscripts>(`/api/articles/user`, {
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
  return useQuery<TManuscripts, Error>({
    queryKey: ['manuscripts', debouncedSearchQuery, selectedStatus],
    queryFn: fetchArticles,
  });
};

export const useGetFinalSubmissions = (articleId: string) => {
  return useQuery({
    queryKey: ['finalSubmissions'],
    queryFn: async () => {
      const { data } = await axios.get(
        `/api/articles/finalSubmissions/${articleId}`
      );
      return data;
    },
    refetchOnWindowFocus: false,
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
  articleId: string;
  title: string;
  doi?: string;
  issueId: string;
  pageRange: string;
};

export const usePublishArticle = () => {
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
      queryClient.invalidateQueries({
        queryKey: ['toBePublishedArticles', 'publishedArticles'],
      });
      toast.success(message);
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
