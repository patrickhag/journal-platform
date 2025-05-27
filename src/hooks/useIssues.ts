import { IssueType } from '@/lib/schemas';
import { Issue, MessageResponse, PublshIssueType } from '@/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { Dispatch, SetStateAction } from 'react';
import { toast } from 'sonner';

export const useGetIssues = () => {
  return useQuery({
    queryKey: ['issues'],
    queryFn: async () => {
      const { data } = await axios.get<Issue[]>(`/api/issues`);
      return data;
    },
  });
};

export const useCreateIssue = (
  setVolumeOpen: Dispatch<SetStateAction<boolean>>
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: IssueType) => {
      return axios.post(`/api/issues/`, data);
    },
    onSuccess: ({ data }) => {
      if (data) {
        queryClient.invalidateQueries({ queryKey: ['issues'] });
        setVolumeOpen(false);
      }
    },
    onError: (error: Error | AxiosError) => {
      console.log('Mutation error:', error);
      const message = axios.isAxiosError(error)
        ? error.response?.data.message
        : error.message;

      toast.error(message || 'Failed to create issue');
    },
  });
};

export const useAssignIssues = () => {
  return useMutation({
    mutationFn: async ({
      articleIds,
      issueId,
    }: {
      articleIds: string[];
      issueId: string;
    }) => {
      const data = {
        issueId,
        articleIds,
      };

      return axios.put<{ message: string }>(`/api/issues/`, data);
    },
    onSuccess: ({ data }) => {
      toast.info(data.message);
    },
    onError: (error: Error | AxiosError) => {
      const message = axios.isAxiosError(error)
        ? error.response?.data.message
        : error.message;

      toast.error(message || "Failed to modify users's status");
    },
  });
};

export const usePublishIssue = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ issueId, articleIds }: PublshIssueType) => {
      const response = await axios.patch<MessageResponse>(
        `/api/issues/${issueId}`,
        { articleIds }
      );
      return response.data;
    },
    onSuccess: ({ message }) => {
      queryClient.invalidateQueries({ queryKey: ['issues'] });
      toast.success(message);
    },
    onError: (error: Error | AxiosError) => {
      const message = axios.isAxiosError(error)
        ? error.response?.data.message
        : error.message;

      toast.error(message || 'Failed to publish issue');
    },
  });
};

export const useDeleteIssue = (
  setOpenDeleteIssueDialog: (openOrClose: boolean) => void
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (issueId: string) => {
      const response = await axios.delete<MessageResponse>(
        `/api/issues/${issueId}`
      );
      return response.data;
    },
    onSuccess: ({ message }) => {
      setOpenDeleteIssueDialog(false);
      queryClient.invalidateQueries({ queryKey: ['issues'] });
      toast.success(message || "Failed to modify article's issues");
    },
    onError: (error: Error | AxiosError) => {
      const message = axios.isAxiosError(error)
        ? error.response?.data.message
        : error.message;

      toast.error(message || 'Failed to delete issue');
    },
  });
};

export const useEditIssue = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      issueId,
      data,
    }: {
      issueId: string;
      data: IssueType & { articles: string[] };
    }) => {
      const response = await axios.put<MessageResponse>(
        `/api/issues/${issueId}`,
        data
      );
      return response.data;
    },
    onSuccess: ({ message }) => {
      queryClient.invalidateQueries({ queryKey: ['issues'] });
      toast.success(message);
    },
    onError: (error: Error | AxiosError) => {
      const message = axios.isAxiosError(error)
        ? error.response?.data.message
        : error.message;

      toast.error(message || 'Failed to update issue');
    },
  });
};

export const useGetIssue = (issueId: string) => {
  return useQuery({
    queryKey: ['issues', issueId],
    queryFn: async () => {
      const { data } = await axios.get<Issue>(`/api/issues/${issueId}`);
      return data;
    },
    enabled: !!issueId,
  });
};
