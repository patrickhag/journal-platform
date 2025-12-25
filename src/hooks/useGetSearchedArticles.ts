import { TPublication } from '@/types';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

interface SearchParams {
  searchQuery?: string;
  title?: string;
  keywords?: string;
  author?: string;
  affiliation?: string;
  fromDate?: Date;
  toDate?: Date;
  volume?: string;
  issue?: string;
}

export const useGetSearchedArticles = (params: SearchParams) => {
  const fetchArticles = async () => {
    // Build query params, removing undefined values
    const queryParams: Record<string, string> = {};

    if (params.searchQuery) queryParams.searchQuery = params.searchQuery;
    if (params.title) queryParams.title = params.title;
    if (params.keywords) queryParams.keywords = params.keywords;
    if (params.author) queryParams.author = params.author;
    if (params.affiliation) queryParams.affiliation = params.affiliation;
    if (params.fromDate) queryParams.fromDate = params.fromDate.toISOString();
    if (params.toDate) queryParams.toDate = params.toDate.toISOString();
    if (params.volume) queryParams.volume = params.volume;
    if (params.issue) queryParams.issue = params.issue;

    const response = await axios.get<TPublication[]>(
      `/api/articles/searched-articles`,
      {
        params: queryParams,
      }
    );

    if (response.status !== 200) {
      throw new Error('Error occurred while fetching articles');
    }

    return response.data;
  };

  // Check if there are any valid filter values
  const hasValidFilters = Object.values(params).some(
    (v) => v !== undefined && v !== '' && v !== null
  );

  return useQuery({
    queryKey: ['articles', params],
    queryFn: fetchArticles,
    enabled: hasValidFilters,
  });
};
