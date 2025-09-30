import { TAd } from '@/db/schema';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { toast } from 'sonner';

type TPayloadData = {
  isActive: boolean;
  title: string;
  linkUrl: string;
  fileId: string;
};

export const useCreateAdverts = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: TPayloadData) => {
      const response = await axios.post<{ message: string }>('/api/ads', data);
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['ads'] });
      toast.success(data.message);
    },
    onError: (error: Error | AxiosError) => {
      const message = axios.isAxiosError(error)
        ? error.response?.data?.message || 'Failed to create advert'
        : error.message;

      toast.error(message);
    },
  });
};

export const useGetEditorAds = () => {
  return useQuery({
    queryKey: ['ads'],
    queryFn: async () => {
      const { data } = await axios.get<TAd[]>(`/api/ads`);
      return data;
    },
  });
};

export const useGetHomeAds = () => {
  return useQuery({
    queryKey: ['home-ads'],
    queryFn: async () => {
      const { data } = await axios.get<TAd[]>(`/api/ads/home`);
      return data;
    },
    refetchOnWindowFocus: false,
  });
};

type EditAdInput = {
  advertId: string;
  data: TPayloadData;
};

type MessageResponse = {
  message: string;
  advert?: any;
};

export const useEditAd = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ advertId, data }: EditAdInput) => {
      const response = await axios.patch<MessageResponse>(
        `/api/ads/${advertId}`,
        data
      );
      return response.data;
    },
    onSuccess: ({ message }) => {
      queryClient.invalidateQueries({ queryKey: ['ads'] });
      toast.success(message);
    },
    onError: (error: Error | AxiosError) => {
      const message = axios.isAxiosError(error)
        ? error.response?.data.error || error.response?.data.message
        : error.message;

      toast.error(message || 'Failed to update advert');
    },
  });
};

export function useDeleteAd() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (advertId: string) => {
      const res = await axios.delete<{ message: string }>(
        `/api/ads/${advertId}`
      );
      return res.data;
    },
    onSuccess: ({ message }) => {
      queryClient.invalidateQueries({ queryKey: ['ads'] });
      toast.info(message);
    },
  });
}
