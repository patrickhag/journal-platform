import { TMetric, TMostViewed } from '@/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { toast } from 'sonner';

type MetricsResponse = {
  success: boolean;
  message: string;
  error?: string;
};

export type CitationFormat =
  | 'bibtexFormat'
  | 'risFormat'
  | 'apaStyle'
  | 'amaStyle';

type IncrementMetricsParams = {
  slug: string;
  downloadCount?: boolean;
  viewCount?: boolean;
  citationFormat?: CitationFormat;
};

export const useIncrementMetrics = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      slug,
      downloadCount,
      viewCount,
      citationFormat,
    }: IncrementMetricsParams) => {
      if (!downloadCount && !viewCount && !citationFormat) {
        throw new Error(
          'Either downloadCount, viewCount, or citationFormat must be specified'
        );
      }
      const response = await axios.post<MetricsResponse>('/api/metrics', {
        slug,
        downloadCount,
        viewCount,
        citationFormat,
      });

      return response.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['metric', variables.slug],
      });
      queryClient.invalidateQueries({
        queryKey: ['metric', variables.slug],
      });
    },
    onError: (error: Error | AxiosError) => {
      const message = axios.isAxiosError(error)
        ? error.response?.data.error || error.response?.data.message
        : error.message;

      toast.error(message || 'Failed to update metrics');
    },
  });
};

export const useGetMetricsInteractions = () => {
  return useQuery({
    queryKey: ['metrics'],
    queryFn: async () => {
      const { data } = await axios.get(`/api/metrics`);
      return data || [];
    },
  });
};

export const useGetMostViewed = () => {
  return useQuery({
    queryKey: ['most-viewed'],
    queryFn: async () => {
      const { data } = await axios.get<TMostViewed>(`/api/metrics/most-viewed`);
      return data || [];
    },
    refetchOnWindowFocus: false,
  });
};

export const useGetMetricInteraction = (slug: string) => {
  return useQuery({
    queryKey: ['metric', slug],
    queryFn: async () => {
      const { data } = await axios.get<TMetric>(`/api/metrics/${slug}`);
      return data;
    },
  });
};
