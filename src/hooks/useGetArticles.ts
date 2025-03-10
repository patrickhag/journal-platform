import { TArticle } from '@/schemas/reviewer';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export const useGetArticles = (
  userId: string,
  debouncedSearchQuery: string,
  selectedStatus: string
) => {
  const fetchArticles = async (): Promise<TArticle[]> => {
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
