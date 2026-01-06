import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { contributorFormSchema } from '@/schemas/upload';
import { z } from 'zod';

export const useUpdateContributor = (
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
) => {
  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: z.infer<typeof contributorFormSchema>;
    }) => {
      const response = await fetch(`/api/contributors/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update contributor');
      }

      return response.json();
    },
    onSuccess: () => {
      setIsOpen(false);
      toast.success('Contributor updated successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update contributor');
    },
  });
};

export const useAddContributor = (
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
) => {
  return useMutation({
    mutationFn: async ({
      articleId,
      data,
    }: {
      articleId: string;
      data: z.infer<typeof contributorFormSchema>;
    }) => {
      const response = await fetch(`/api/contributors/${articleId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to add contributor');
      }

      return response.json();
    },
    onSuccess: () => {
      setIsOpen(false);
      toast.success('Contributor added successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to add contributor');
    },
  });
};

