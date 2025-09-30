import {
  TAssociateEditorAssignment,
  TAssociateEditorAssignmentsInfo,
} from '@/types';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

export const useAssignedAssociateEditor = () => {
  return useQuery({
    queryKey: ['associateEditorAssignments'],
    queryFn: async () => {
      const { data } =
        await axios.get<TAssociateEditorAssignment[]>(`/api/staff-editor`);
      return data;
    },
  });
};

export const useGetAssignedAssociateEditors = () => {
  return useQuery({
    queryKey: ['associateEditors'],
    queryFn: async () => {
      const { data } = await axios.get<TAssociateEditorAssignmentsInfo[]>(
        `/api/associate-editor/associate-users`
      );
      return data;
    },
  });
};

export const useAssociateEditorFunctions = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { articleId: string; userId: string }) => {
      return axios.patch(`/api/associate-editor`, data);
    },
    onSuccess: ({ data }) => {
      if (data.message) {
        queryClient.invalidateQueries({ queryKey: ['associateEditors'] });
        toast.success(data.message);
      }
    },
    onError: (error: Error | AxiosError) => {
      const message = axios.isAxiosError(error)
        ? error.response?.data?.message
        : error.message;
      toast.error(message || 'Failed to unassign editor');
    },
  });
};
