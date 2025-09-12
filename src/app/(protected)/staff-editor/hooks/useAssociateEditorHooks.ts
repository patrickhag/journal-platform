import { TAssociateEditorAssignment } from '@/types';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

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
