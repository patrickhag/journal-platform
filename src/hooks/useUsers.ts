import { TUsers } from '@/db/schema';
import { TParticipants, TReviewers, TSUser, TUserInfo } from '@/types';
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

export const useGetAllEditors = () => {
  return useQuery({
    queryKey: ['editors'],
    queryFn: async () => {
      const { data } = await axios.get(`/api/users`);
      return data;
    },
  });
};

export const useGetUserInfo = (userId: string) => {
  return useQuery({
    queryKey: ['user', userId],
    queryFn: async () => {
      const { data } = await axios.get<TUserInfo>(`/api/users/user/${userId}`);
      return data;
    },
  });
};

export const useGetEditors = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const { data } = await axios.get<TSUser[]>(`/api/editor/editors/`);
      return data || [];
    },
  });
};

export const useGetReviewers = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const { data } = await axios.get<TReviewers>(`/api/reviewers/`);
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
      const response = await axios.post<{ message: string; error: string }>(
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

      toast.error(message);
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

type DeactivateUser = {
  isActive?: boolean;
  role?: string;
};

export const useDeactivateUser = (userId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: DeactivateUser) => {
      const response = await axios.patch<{ message: string }>(
        `/api/users/user/${userId}`,
        data
      );
      return response;
    },
    onSuccess: ({ data }) => {
      if (data) {
        queryClient.invalidateQueries({ queryKey: ['user', userId] });
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

export const useChangeUserRole = (userId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: DeactivateUser) => {
      const response = await axios.put<{ message: string }>(
        `/api/users/user/${userId}`,
        data
      );
      return response;
    },
    onSuccess: ({ data }) => {
      if (data) {
        queryClient.invalidateQueries({ queryKey: ['user', userId] });
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

export const useAddToEditorialBoard = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ userIds }: { userIds?: string[] }) => {
      return axios.post<{ message: string }>(`/api/users/`, {
        userIds,
      });
    },
    onSuccess: ({ data }) => {
      toast.info(data.message);
      queryClient.invalidateQueries({ queryKey: ['editorial-board'] });
    },
    onError: (error: Error | AxiosError) => {
      const message = axios.isAxiosError(error)
        ? error.response?.data.message
        : error.message;
      toast.error(message || 'Failed to pick article(s)');
    },
  });
};

export const useGetParticipants = (articleId: string) => {
  return useQuery({
    queryKey: ['participants'],
    queryFn: async () => {
      const { data } = await axios.get<TParticipants>(
        `/api/users/participants/${articleId}`
      );
      return data;
    },
  });
};
