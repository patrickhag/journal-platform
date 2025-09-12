import { TMetric, TMostViewed } from '@/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { toast } from 'sonner';

type MetricsResponse = {
  success: boolean;
  message: string;
  error?: string;
};

type IncrementMetricsParams = {
  slug: string;
  downloadCount?: boolean;
  viewCount?: boolean;
};

export const useIncrementMetrics = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      slug,
      downloadCount,
      viewCount,
    }: IncrementMetricsParams) => {
      if (!downloadCount && !viewCount) {
        throw new Error('Either downloadCount or viewCount must be specified');
      }
      const response = await axios.post<MetricsResponse>('/api/metrics', {
        slug,
        downloadCount,
        viewCount,
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
    queryKey: ['metric'],
    queryFn: async () => {
      const { data } = await axios.get<TMetric>(`/api/metrics/${slug}`);
      return data || [];
    },
  });
};
