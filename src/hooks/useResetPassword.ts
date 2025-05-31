import { useMutation } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { toast } from 'sonner';

type RequestData = {
  email: string;
  password: string;
};

export const useResetPassword = () => {
  return useMutation({
    mutationFn: async (data: RequestData) => {
      const response = await axios.post<{ message: string; success: boolean }>(
        '/api/auth/reset-password',
        data
      );
      return response.data;
    },
    onSuccess: (data) => {
      toast.success(data.message || 'Password reset email sent successfully');
    },
    onError: (error) => {
      const message = axios.isAxiosError(error)
        ? error.response?.data.message
        : error.message;
      toast.error(message || 'Failed to reset password');
    },
  });
};
