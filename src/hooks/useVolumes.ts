import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { toast } from 'sonner';
import { Dispatch, SetStateAction } from 'react';
import { MessageResponse, VolumeType } from '@/types';
import { VolumeType as VolumeFormValues } from '@/lib/schemas';

export const useGetVolumes = () => {
  return useQuery({
    queryKey: ['volumes'],
    queryFn: async () => {
      const { data } = await axios.get<VolumeType>(`/api/volumes`);
      return data || [];
    },
  });
};

export const useCreateVolume = (
  setVolumeOpen: Dispatch<SetStateAction<boolean>>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: VolumeFormValues) => {
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

export const useDeleteVolume = (
  setOpenDeleteIssueDialog: (openOrClose: boolean) => void
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (volumeId: string) => {
      const response = await axios.delete<MessageResponse>(
        `/api/volumes/${volumeId}`
      );
      return response.data;
    },
    onSuccess: ({ message }) => {
      setOpenDeleteIssueDialog(false);
      queryClient.invalidateQueries({ queryKey: ['volumes'] });
      toast.success(message);
    },
    onError: (error: Error | AxiosError) => {
      const message = axios.isAxiosError(error)
        ? error.response?.data.message
        : error.message;

      toast.error(message || 'Failed to delete volume');
    },
  });
};

export const useGetPublishedVolumes = () => {
  return useQuery({
    queryKey: ['publishedVolumes'],
    queryFn: async () => {
      const { data } = await axios.get<VolumeType>(`/api/volumes/published`);
      return Array.isArray(data) ? data : [];
    },
    refetchOnWindowFocus: false,
  });
};

export const useEditVolume = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      volumeId,
      data,
    }: {
      volumeId: string;
      data: VolumeFormValues;
    }) => {
      const response = await axios.put<MessageResponse>(
        `/api/volumes/${volumeId}`,
        data
      );
      return response.data;
    },
    onSuccess: ({ message }) => {
      queryClient.invalidateQueries({ queryKey: ['volumes'] });
      toast.success(message);
    },
    onError: (error: Error | AxiosError) => {
      const message = axios.isAxiosError(error)
        ? error.response?.data.message
        : error.message;

      toast.error(message || 'Failed to update volume');
    },
  });
};
