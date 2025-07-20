import { Metadata } from '@/types';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

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

type TPayloadData = {
  userId: string;
  updatedFiles: {
    publicId: string;
    resourceType: string;
    originalName: string;
    fileType?: string | undefined;
    bytes?: string | undefined;
  }[];
};

export const useUpdateManuscriptFiles = (id: string) => {
  return useMutation({
    mutationFn: async (data: TPayloadData) => {
      const response = await fetch(`/api/metadata/${id}`, {
        method: 'POST',
        body: JSON.stringify(data),
      });
      return response;
    },
    onSuccess: () => {
      toast.success('Manuscript file(s) added succesfully');
    },
  });
};
