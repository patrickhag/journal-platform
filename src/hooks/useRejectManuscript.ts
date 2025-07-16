import { useMutation } from '@tanstack/react-query';

export const useRejectManuscript = () => {
  return useMutation({
    mutationFn: async (articleId: string) => {
      const response = await fetch(`/api/reject-manuscript/${articleId}`, {
        method: 'PUT',
      });
      return response;
    },
  });
};

export const useAcceptManuscript = () => {
  return useMutation({
    mutationFn: async ({ articleId }: { articleId: string }) => {
      const response = await fetch(`/api/accept-manuscript/${articleId}`, {
        method: 'PUT',
      });
      return response;
    },
  });
};
