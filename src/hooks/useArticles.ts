import { TArticle } from '@/schemas/reviewer';
import { MessageResponse } from '@/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { toast } from 'sonner';

export const useGetUserArticles = (
  userId: string,
  debouncedSearchQuery: string,
  selectedStatus: string,
  selectedType: string
) => {
  const fetchArticles = async () => {
    const response = await axios.get<TArticle[]>(`/api/articles/${userId}`, {
      params: {
        searchQuery: debouncedSearchQuery,
        articleStatus: selectedStatus,
        articleType: selectedType,
      },
    });

    if (response.status !== 200) {
      throw new Error('Error occurred while fetching articles');
    }

    return response.data;
  };
  return useQuery<TArticle[], Error>({
    queryKey: [
      'manuscripts',
      userId,
      debouncedSearchQuery,
      selectedStatus,
      selectedType,
    ],
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
  const fetchArticles = async (): Promise<TArticle[]> => {
    const response = await axios.get<TArticle[]>(`/api/articles`);

    if (response.status !== 200) {
      throw new Error('Error occurred while fetching articles');
    }

    return response.data;
  };
  return useQuery<TArticle[], Error>({
    queryKey: ['acceptedArticles'],
    queryFn: fetchArticles,
    refetchOnWindowFocus: false,
  });
};
