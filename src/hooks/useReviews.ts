import { ReviewFormData } from '@/schemas/reviewer';
import { MessageResponse } from '@/types';
import { useMutation } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { Dispatch, SetStateAction } from 'react';
import { toast } from 'sonner';

export const useCreateReview = (
  setReviewModalOpen: Dispatch<SetStateAction<boolean>>
) => {
  return useMutation({
    mutationFn: async (data: ReviewFormData) => {
      return axios.post<MessageResponse>('/api/reviews', data);
    },
    onSuccess: ({ data }) => {
      if (data.message) {
        setReviewModalOpen(false);
      }
    },
    onError: (error: Error | AxiosError) => {
      console.error('Review submission error:', error);
      const message = axios.isAxiosError(error)
        ? error.response?.data?.message
        : error.message;

      toast.error(message || 'Failed to submit review');
    },
  });
};
