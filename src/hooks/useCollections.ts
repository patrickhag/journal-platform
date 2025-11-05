import { CollectionFormValues } from '@/lib/schemas';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { toast } from 'sonner';
import { MessageResponse, TCollections } from '@/types';

export const useGetCollections = (page = 1, limit = 10) => {
  return useQuery({
    queryKey: ['collections', page, limit],
    queryFn: async () => {
      const { data } = await axios.get(`/api/collections`, {
        params: { page, limit },
      });
      return data;
    },
  });
};

export const useCreateCollection = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CollectionFormValues) => {
      const response = await axios.post('/api/collections', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['collections'] });
      toast.success('Collection created successfully');
    },
    onError: (error: Error | AxiosError) => {
      console.error('Mutation error:', error);
      const message = axios.isAxiosError(error)
        ? error.response?.data?.error || 'Failed to create collection'
        : error.message;

      toast.error(message);
    },
  });
};

export const useAssignCollectionArticles = () => {
  return useMutation({
    mutationFn: async ({
      articleIds,
      collectionId,
    }: {
      articleIds: string[];
      collectionId: string;
    }) => {
      const data = {
        collectionId,
        articleIds,
      };

      return axios.put<{ message: string }>(`/api/collections`, data);
    },
    onSuccess: ({ data }) => {
      toast.success(data.message);
    },
    onError: (error: Error | AxiosError) => {
      const message = axios.isAxiosError(error)
        ? error.response?.data?.message
        : error.message;

      toast.error(message || 'Failed to assign articles to collection');
    },
  });
};

type TPayload = {
  title: string;
  thumbnailUrl: string;
  description: string;
  sdgGoal: string;
  objective?: string | undefined;
  isFeatured?: boolean | undefined;
  removedArticles: string[];
};

export const useEditCollection = (collectionId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: TPayload) => {
      const response = await axios.put<MessageResponse>(
        `/api/collections/${collectionId}`,
        data
      );
      return response.data;
    },
    onSuccess: ({ message }) => {
      queryClient.invalidateQueries({ queryKey: ['collections'] });
      toast.success(message);
    },
    onError: (error: Error | AxiosError) => {
      const message = axios.isAxiosError(error)
        ? error.response?.data.message
        : error.message;

      toast.error(message || 'Failed to update collection');
    },
  });
};

export const useDeleteCollection = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (collectionId: string) => {
      const response = await axios.delete<MessageResponse>(
        `/api/collections/${collectionId}`
      );
      return response.data;
    },
    onSuccess: ({ message }) => {
      queryClient.invalidateQueries({ queryKey: ['collections'] });
      toast.success(message);
    },
    onError: (error: Error | AxiosError) => {
      const message = axios.isAxiosError(error)
        ? error.response?.data.message
        : error.message;

      toast.error(message || 'Failed to delete collection');
    },
  });
};
