import { ReviewFormData } from '@/schemas/reviewer';
import {
  MessageResponse,
  PReview,
  TArticlesReview,
  TAssignment,
  TAssociateEditorAssignments,
  TAssociateEditorCollection,
  TAssociateEditors,
  TReview,
  TReviewerAssignment,
  TReviewerInfo,
} from '@/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { toast } from 'sonner';

export const useCreateReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: ReviewFormData) => {
      return axios.post<MessageResponse>('/api/reviews', data);
    },
    onSuccess: ({ data }) => {
      if (data.message) {
        toast.success(data.message);
        queryClient.invalidateQueries({
          queryKey: ['reviewerAssignments', 'particularAssignment'],
        });
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
      const { data } = await axios.get(`/api/reviews/`);
      const assignedArticles = data.assignedArticles as TReviewerAssignment;
      const dueArticles = data.dueArticles as TReviewerAssignment;
      return { assignedArticles, dueArticles };
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

export const useGetAuthorsReviews = () => {
  return useQuery({
    queryKey: ['authorReviews'],
    queryFn: async () => {
      const { data } =
        await axios.get<TArticlesReview[]>(`/api/reviews/author`);
      return data;
    },
  });
};

type TpayloadData = {
  reviewerId: string;
  articleId: string;
  message: string;
  reviewerEmail: string;
  reviewerName: string;
  articleTitle: string;
};

export const useAuthorReplyReviewer = () => {
  return useMutation({
    mutationFn: async (data: TpayloadData) => {
      return axios.post<MessageResponse>(`/api/reviews/author`, data);
    },
    onSuccess: ({ data }) => {
      if (data.message) {
        toast.success(data.message);
      }
    },
    onError: (error: Error | AxiosError) => {
      console.error('Author submission error:', error.message);
      const message = axios.isAxiosError(error)
        ? error.response?.data?.message
        : error.message;

      toast.error(message || 'Failed to submit author response');
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

export const usePublishAcceptedArticle = (
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
        queryClient.invalidateQueries({ queryKey: ['publishedArticles'] });
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

export const useGetAllCompleted = () => {
  return useQuery({
    queryKey: ['allRevisions'],
    queryFn: async () => {
      const { data } = await axios.get<PReview[]>(`/api/reviews/all`);
      return data;
    },
  });
};

export const useGetReviewersInfo = () => {
  return useQuery({
    queryKey: ['reviewersInfo'],
    queryFn: async () => {
      const { data } = await axios.get<TReviewerInfo[]>(`/api/reviewers/all`);
      return data || [];
    },
  });
};

export const useReviewerFunctions = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      userId?: string;
      articleId?: string;
      isItNotification?: boolean;
    }) => {
      return axios.patch<MessageResponse>('/api/reviewers/all', data);
    },
    onSuccess: ({ data }) => {
      if (data.message) {
        queryClient.invalidateQueries({ queryKey: ['reviewersInfo'] });
        toast.success(data.message);
      }
    },
    onError: (error: Error | AxiosError) => {
      console.error('Review submission error:', error);
      const message = axios.isAxiosError(error)
        ? error.response?.data?.message
        : error.message;

      toast.error(message || 'Failed to unassign reviewer');
    },
  });
};

export const useGetAssociateEditors = () => {
  return useQuery({
    queryKey: ['associateEditors'],
    queryFn: async () => {
      const { data } = await axios.get<TAssociateEditors[]>(
        `/api/associate-editor/`
      );
      return data || [];
    },
  });
};

export const useGetAssociateEditorsAssignments = () => {
  return useQuery({
    queryKey: ['associateEditorsAssignments'],
    queryFn: async () => {
      const { data } = await axios.get<TAssociateEditorAssignments[]>(
        `/api/associate-editor/assignments`
      );
      return data || [];
    },
  });
};

export const useAssignAssociateEditor = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      articleId: string;
      userId: string;
      editorName: string;
      editorEmail: string;
      date: Date;
      articleTitle: string;
      staffEditorId: string;
      message: string;
    }) => {
      return axios.post<MessageResponse>('/api/associate-editor/', data);
    },
    onSuccess: ({ data }) => {
      if (data.message) {
        queryClient.invalidateQueries({ queryKey: ['reviewersInfo'] });
        toast.success(data.message);
      }
    },
    onError: (error: Error | AxiosError) => {
      console.error('Review submission error:', error);
      const message = axios.isAxiosError(error)
        ? error.response?.data?.message
        : error.message;

      toast.error(message || 'Failed to unassign reviewer');
    },
  });
};

export const useSubmitCollection = () => {
  return useMutation({
    mutationFn: async (data: {
      fileIds: string[];
      articleId: string;
      staffEditorName: string;
      articleTitle: string | undefined;
      staffEditorEmail: string | undefined;
    }) => {
      return axios.post<MessageResponse>(
        '/api/associate-editor/assignments',
        data
      );
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

export const useGetAssociateEditorsCollections = (articleId: string) => {
  return useQuery({
    queryKey: ['associateEditorCollections'],
    queryFn: async () => {
      const { data } = await axios.get<TAssociateEditorCollection[]>(
        `/api/associate-editor/assignments/${articleId}`
      );
      return data || [];
    },
  });
};

export const useGetParticularAssignment = (assignmentId: string) => {
  return useQuery({
    queryKey: ['particularAssignment'],
    queryFn: async () => {
      const { data } = await axios.get<TAssignment>(
        `/api/reviewers/${assignmentId}`
      );
      return data || [];
    },
  });
};
