import { useClearURL } from '@/components/ClearURL';
import { ReviewFormData } from '@/schemas/reviewer';
import { MessageResponse, TReview, TReviewerAssignment } from '@/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { toast } from 'sonner';

export const useCreateReview = () => {
  return useMutation({
    mutationFn: async (data: ReviewFormData) => {
      console.log('data>>>', data);
      return axios.post<MessageResponse>('/api/reviews', data);
    },
    onSuccess: ({ data }) => {
      if (data.message) {
        toast.success(data.message);
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

type TData = {
  assignmentId: string;
};

export const useAcceptReviewAssignment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: TData) => {
      console.log('payload-data:', data);
      return axios.patch<MessageResponse>('/api/reviews', data);
    },
    onSuccess: ({ data }) => {
      if (data.message) {
        queryClient.invalidateQueries({ queryKey: ['reviewerAssignments'] });
        toast.success(data.message);
      }
    },
    onError: (error: Error | AxiosError) => {
      console.error('Review submission error:', error);
      const message = axios.isAxiosError(error)
        ? error.response?.data?.message
        : error.message;

      toast.error(message || 'Failed to accept review');
    },
  });
};

export const useGetReviewerAssignments = () => {
  return useQuery({
    queryKey: ['reviewerAssignments'],
    queryFn: async () => {
      const { data } = await axios.get<TReviewerAssignment[]>(`/api/reviews/`);
      return data || [];
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
        toast.success(data.message);
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
        toast.success(data.message);
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

type ReRevisionType = {
  message: string;
  fileIds: string[];
  reviewerId: string;
  reviewerName: string;
  reviewerEmail: string;
};

export const useSendReRevision = (articleId: string) => {
  return useMutation({
    mutationFn: async (data: ReRevisionType) => {
      return axios.put<MessageResponse>(`/api/editor/${articleId}`, data);
    },
    onSuccess: ({ data }) => {
      if (data.message) {
        toast.success(data.message);
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

export const useAcceptArticle = (
  articleId: string,
  onOpenChange: (open: boolean) => void
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      return axios.patch<MessageResponse>(`/api/editor/${articleId}`);
    },
    onSuccess: ({ data }) => {
      if (data.message) {
        queryClient.invalidateQueries({ queryKey: ['reviewerAssignments'] });
        toast.success(data.message);
        onOpenChange(false);
      }
    },
    onError: (error: Error | AxiosError) => {
      const message = axios.isAxiosError(error)
        ? error.response?.data?.message
        : error.message;

      toast.error(message || 'Failed to accept article');
    },
  });
};

export const useSendInvitation = (articleId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      return axios.patch<MessageResponse>(`/api/editor/${articleId}`);
    },
    onSuccess: ({ data }) => {
      if (data.message) {
        queryClient.invalidateQueries({ queryKey: ['reviewerAssignments'] });
        toast.success(data.message);
      }
    },
    onError: (error: Error | AxiosError) => {
      const message = axios.isAxiosError(error)
        ? error.response?.data?.message
        : error.message;

      toast.error(message || 'Failed to accept article');
    },
  });
};
