import { TManuals } from '@/db/schema';
import { EditorsPicks } from '@/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { toast } from 'sonner';

export const useEditorsPick = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      articleIds,
      articleId,
    }: {
      articleIds?: string[];
      articleId?: string;
    }) => {
      return axios.patch<{ message: string }>(`/api/articles/editors-pick/`, {
        articleIds,
        articleId,
      });
    },
    onSuccess: ({ data }) => {
      toast.info(data.message);
      queryClient.invalidateQueries({ queryKey: ['editorsPick'] });
    },
    onError: (error: Error | AxiosError) => {
      const message = axios.isAxiosError(error)
        ? error.response?.data.message
        : error.message;
      toast.error(message || 'Failed to pick article(s)');
    },
  });
};

export const useGetEditorsPick = () => {
  return useQuery({
    queryKey: ['editorsPick'],
    queryFn: async () => {
      const { data } = await axios.get<EditorsPicks>(
        `/api/articles/editors-pick`
      );
      return data;
    },
  });
};

export const useCreateManuals = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      guidelines,
      aboutUs,
      policies,
      aimsNscope,
    }: {
      guidelines?: unknown;
      aboutUs?: unknown;
      policies?: unknown;
      aimsNscope?: unknown;
    }) => {
      return axios.post(`/api/manuals/`, {
        guidelines,
        aboutUs,
        policies,
        aimsNscope,
      });
    },
    onSuccess: ({ data }) => {
      toast.info(data.message);
      queryClient.invalidateQueries({ queryKey: ['manuals'] });
    },
    onError: (error: Error | AxiosError) => {
      const message = axios.isAxiosError(error)
        ? error.response?.data.message
        : error.message;

      toast.error(message || 'Failed to create manual');
    },
  });
};

export const useGetManuals = () => {
  return useQuery({
    queryKey: ['manuals'],
    queryFn: async () => {
      const res = await axios.get('/api/manuals');
      return res.data;
    },
  });
};
