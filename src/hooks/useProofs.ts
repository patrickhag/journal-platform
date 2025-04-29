import { ProofFormValues } from '@/lib/schemas';
import { IArticle, MessageResponse } from '@/types';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { toast } from 'sonner';
import { Dispatch, SetStateAction } from 'react';

export const useGetProofs = (userId: string) => {
  return useQuery({
    queryKey: ['proofs'],
    queryFn: async () => {
      const { data } = await axios.get<IArticle[]>(`/api/articles`);
      return data;
    },
    enabled: !!userId,
  });
};

export const useGetProof = (userId: string) => {
  return useQuery({
    queryKey: ['proofs'],
    queryFn: async () => {
      const { data } = await axios.get<IArticle[]>(`/api/proofs/${userId}`);
      return data;
    },
    enabled: !!userId,
  });
};

export const useCreateProof = (
  onOpenChange: Dispatch<SetStateAction<boolean>>,
  clearUrl: () => void
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: ProofFormValues) => {
      const response = await axios.post<MessageResponse>(`/api/proofs/`, data);
      return response.data;
    },
    onSuccess: ({ message }) => {
      queryClient.invalidateQueries({ queryKey: ['proofs'] });
      onOpenChange(false);
      clearUrl();
      toast.success(message);
    },
    onError: (error: Error | AxiosError) => {
      const message = axios.isAxiosError(error)
        ? error.response?.data.message
        : error.message;

      toast.error(message || 'Failed to create create proof.');
    },
  });
};
