import { Metadata } from '@/types';
import { useMutation } from '@tanstack/react-query';

export const useUpdateMetadata = (
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
) => {
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Metadata }) => {
      const response = await fetch(`/api/metadata/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      });
      return response;
    },
    onSuccess: () => {
      setIsOpen(false);
    },
  });
};
