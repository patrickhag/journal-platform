import { TContacts, TFeedbacks } from '@/db/schema';
import { useMutation, useQuery } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { toast } from 'sonner';

// Contact hook

type TContactData = {
  message: string;
  firstName: string;
  lastName: string;
  email: string;
  subject: string;
  institution?: string | undefined;
};

export const useCreateContact = () => {
  return useMutation({
    mutationFn: async (data: TContactData) => {
      return axios.post(`/api/contacts`, data);
    },
    onSuccess: ({ data }) => {
      toast.success(data.message);
    },
    onError: (error: Error | AxiosError) => {
      console.log('Mutation error:', error);
      const message = axios.isAxiosError(error)
        ? error.response?.data.message
        : error.message;

      toast.error(message || 'Failed to create contact');
    },
  });
};

type TFeedbackData = {
  feedbackType: string;
  feedbackMessage: string;
  name?: string | undefined;
  email?: string | undefined;
  rating?: string | undefined;
};

export const useCreateFeedback = () => {
  return useMutation({
    mutationFn: async (data: TFeedbackData) => {
      return axios.post<{ message: string }>(`/api/contacts/feedback`, data);
    },
    onSuccess: ({ data }) => {
      toast.info(data.message);
    },
    onError: (error: Error | AxiosError) => {
      console.log('Mutation error:', error);
      const message = axios.isAxiosError(error)
        ? error.response?.data.message
        : error.message;

      toast.error(message || 'Failed to create feedback');
    },
  });
};

export const useGetContacts = () => {
  return useQuery({
    queryKey: ['contacts'],
    queryFn: async () => {
      const { data } = await axios.get<TContacts[]>(`/api/contacts`);
      return data;
    },
  });
};

export const useGetFeedbacks = () => {
  return useQuery({
    queryKey: ['feedbacks'],
    queryFn: async () => {
      const { data } = await axios.get<TFeedbacks[]>(`/api/contacts/feedback`);
      return data;
    },
  });
};
