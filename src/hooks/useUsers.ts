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
