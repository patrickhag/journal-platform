import { TUsers } from '@/db/schema';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { toast } from 'sonner';

export const useGetUsers = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const { data } = await axios.get(`/api/users`);
      return data;
    },
  });
};

export const useGetEditors = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const { data } = await axios.get<TUsers[]>(`/api/editor/editors/`);
      return data || [];
    },
  });
};

export const useGetReviewers = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const { data } = await axios.get<TUsers[]>(`/api/reviewers/`);
      return data || [];
    },
  });
};

type TInviteData = {
  reviewerNames: string;
  toEmail: string;
  date: Date;
  articleId: string | string[] | undefined;
};

export const useInviteReviewer = () => {
  return useMutation({
    mutationFn: async (data: TInviteData) => {
      console.log('payload-data:', data);
      const response = await axios.post<{ message: string }>(
        `/api/reviewers/invitation`,
        data
      );
      return response;
    },
    onSuccess: ({ data }) => {
      if (data) {
        toast.info(data.message);
      }
    },
    onError: (error: Error | AxiosError) => {
      const message = axios.isAxiosError(error)
        ? error.response?.data.message
        : error.message;

      toast.error(message || 'Failed to invite reviewer');
    },
  });
};

type TReviwerPayloadData = {
  userId: string;
  articleId: string;
  reviewerName: string;
  reviewerEmail: string;
};

export const useAssignReviewer = () => {
  return useMutation({
    mutationFn: async (data: TReviwerPayloadData) => {
      const response = await axios.post<{ message: string }>(
        `/api/reviewers/`,
        data
      );
      return response;
    },
    onSuccess: ({ data }) => {
      if (data) {
        toast.info(data.message);
      }
    },
    onError: (error: Error | AxiosError) => {
      const message = axios.isAxiosError(error)
        ? error.response?.data.message
        : error.message;

      toast.error(message || 'Failed to assign editor');
    },
  });
};

type TEditorPayloadData = {
  userId: string;
  articleId: string;
  editorName: string;
  editorEmail: string;
};

export const useAssignEditor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: TEditorPayloadData) => {
      const response = await axios.post<{ message: string }>(
        `/api/editor/editors`,
        data
      );
      return response;
    },
    onSuccess: ({ data }) => {
      if (data) {
        toast.success(data.message);
      }
    },
    onError: (error: Error | AxiosError) => {
      const message = axios.isAxiosError(error)
        ? error.response?.data.message
        : error.message;

      toast.error(message || 'Failed to assign editor');
    },
  });
};

export const useDeactivateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      data,
    }: {
      data: {
        isActive?: boolean;
        userId?: string;
        role?: string;
      };
    }) => {
      const response = await axios.patch<{ message: string }>(
        `/api/users`,
        data
      );
      return response;
    },
    onSuccess: ({ data }) => {
      if (data) {
        queryClient.invalidateQueries({ queryKey: ['users'] });
        toast.info(data.message);
      }
    },
    onError: (error: Error | AxiosError) => {
      const message = axios.isAxiosError(error)
        ? error.response?.data.message
        : error.message;

      toast.error(message || 'Failed to update user');
    },
  });
};
