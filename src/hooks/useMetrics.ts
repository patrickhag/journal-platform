import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { toast } from 'sonner';

type MetricsResponse = {
  success: boolean;
  message: string;
  error?: string;
};

type IncrementMetricsParams = {
  articleId: string;
  downloadCount?: boolean;
  viewCount?: boolean;
};

export const useIncrementMetrics = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      articleId,
      downloadCount,
      viewCount,
    }: IncrementMetricsParams) => {
      if (!downloadCount && !viewCount) {
        throw new Error('Either downloadCount or viewCount must be specified');
      }
      const response = await axios.post<MetricsResponse>('/api/metrics', {
        articleId,
        downloadCount,
        viewCount,
      });

      return response.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['articles', variables.articleId],
      });
      queryClient.invalidateQueries({
        queryKey: ['metrics', variables.articleId],
      });

      if (data.message) {
        toast.success(data.message);
      }
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
