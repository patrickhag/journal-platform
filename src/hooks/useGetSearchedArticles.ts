import { TPublication } from '@/types';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

interface SearchParams {
  searchQuery: string;
  keywords?: string;
  author?: string;
  affiliation?: string;
  fromDate?: Date;
  toDate?: Date;
}

export const useGetSearchedArticles = ({ searchQuery }: SearchParams) => {
  const fetchArticles = async () => {
    console.log('searchQuery:', searchQuery);
    const response = await axios.get<TPublication[]>(
      `/api/articles/searched-articles`,
      {
        params: {
          searchQuery,
        },
      }
    );

    if (response.status !== 200) {
      throw new Error('Error occurred while fetching articles');
    }

    return response.data;
  };
  return useQuery({
    queryKey: ['articles', searchQuery],
    queryFn: fetchArticles,
  });
};
