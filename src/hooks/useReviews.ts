import { DecisionFormData } from '@/lib/schemas';
import { ReviewFormData } from '@/schemas/reviewer';
import { MessageResponse, TReview } from '@/types';
import { useMutation, useQuery } from '@tanstack/react-query';
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

export const useGetReviews = (articleId: string) => {
  return useQuery({
    queryKey: ['reviews'],
    queryFn: async () => {
      const { data } = await axios.get<TReview>(`/api/reviews/${articleId}`);
      return data;
    },
  });
};

type EditorType = {
  decision: string;
  message: string;
  fileId: string;
};

export const useSendEditorDecision = (articleId: string) => {
  return useMutation({
    mutationFn: async (data: EditorType) => {
      return axios.post<MessageResponse>(`/api/editor/${articleId}`, data);
    },
    onSuccess: ({ data }) => {
      if (data.message) {
        toast(data.message);
      }
    },
    onError: (error: Error | AxiosError) => {
      console.error('Editor decision error:', error.message);
      const message = axios.isAxiosError(error)
        ? error.response?.data?.message
        : error.message;

      toast.error(message || 'Failed to submit decision');
    },
  });
};

type RevisionType = {
  note: string;
  fileIds: string[];
};

export const useSendAuthorRevision = (articleId: string) => {
  return useMutation({
    mutationFn: async (data: RevisionType) => {
      return axios.post<MessageResponse>(`/api/users/${articleId}`, data);
    },
    onSuccess: ({ data }) => {
      if (data.message) {
        toast(data.message);
      }
    },
    onError: (error: Error | AxiosError) => {
      console.error('Author revision error:', error.message);
      const message = axios.isAxiosError(error)
        ? error.response?.data?.message
        : error.message;

      toast.error(message || 'Failed to submit revision');
      console.error(message);
    },
  });
};
