import { VolumeType, VolumeTypeExtended } from '@/lib/schemas';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { toast } from 'sonner';
import { Dispatch, SetStateAction } from 'react';

export const useGetVolumes = () => {
  return useQuery({
    queryKey: ['volumes'],
    queryFn: async () => {
      const { data } = await axios.get<VolumeTypeExtended[]>(`/api/volumes`);
      return data || [];
    },
  });
};

export const useCreateVolume = (
  setVolumeOpen: Dispatch<SetStateAction<boolean>>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: VolumeType) => {
      console.log('to be sent data>>>', data);
      return axios.post(`/api/volumes/`, data);
    },
    onSuccess: ({ data }) => {
      if (data) {
        queryClient.invalidateQueries({ queryKey: ['volumes'] });
        setVolumeOpen(false);
      }
    },
    onError: (error: Error | AxiosError) => {
      console.log('Mutation error:', error);
      const message = axios.isAxiosError(error)
        ? error.response?.data.message
        : error.message;

      toast.error(message || 'Failed to create volume');
    },
  });
};
